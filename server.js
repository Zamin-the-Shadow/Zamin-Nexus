import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for Document Chamber
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

// Database connection pool
let pool;

async function initDb() {
  try {
    // Connect without database first to create it if it doesn't exist
    const initialConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
    });

    await initialConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'nexus_platform'}\`;`);
    await initialConnection.end();

    // Now create a pool using the newly created database
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'nexus_platform',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log('✅ Connected to MySQL database successfully!');
    
    // Create necessary tables and seed data
    await createTablesAndSeed();

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Please check your .env file and ensure MySQL is running and your password is correct.');
  }
}

async function createTablesAndSeed() {
  if (!pool) return;
  
  try {
    // Create Investors table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS investors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        investments INT DEFAULT 0,
        avatar VARCHAR(255),
        online BOOLEAN DEFAULT false,
        tags JSON,
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        bio TEXT,
        history JSON,
        preferences JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure columns exist (in case table was created before columns were added to code)
    try { await pool.query('ALTER TABLE users ADD COLUMN bio TEXT AFTER password'); } catch (e) {}
    try { await pool.query('ALTER TABLE users ADD COLUMN history JSON AFTER bio'); } catch (e) {}
    try { await pool.query('ALTER TABLE users ADD COLUMN preferences JSON AFTER history'); } catch (e) {}

    // Create Conversations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        last_message TEXT,
        time VARCHAR(50),
        unread INT DEFAULT 0,
        online BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversation_id INT,
        sender VARCHAR(255),
        text TEXT,
        time VARCHAR(50),
        isMe BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id)
      )
    `);

    // Create Notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50),
        title VARCHAR(255),
        description TEXT,
        time VARCHAR(50),
        unread BOOLEAN DEFAULT true,
        icon VARCHAR(50),
        iconColor VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Documents table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        type VARCHAR(50),
        size VARCHAR(50),
        date VARCHAR(50),
        icon VARCHAR(50),
        color VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Meetings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS meetings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        date VARCHAR(255),
        time VARCHAR(50),
        participants JSON,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        amount DECIMAL(10, 2),
        type VARCHAR(50),
        status VARCHAR(50) DEFAULT 'Completed',
        date VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    
    console.log('✅ MySQL Tables created or verified successfully!');

    // Check if investors exist, if not, seed the database
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM investors');
    
    if (rows[0].count === 0) {
      console.log('🌱 Seeding database with dummy investors...');
      
      const seedData = [
        {
          name: 'Michael Rodriguez',
          role: 'Partner at Horizon Ventures',
          investments: 12,
          avatar: '/michael_rodriguez.png',
          online: true,
          tags: JSON.stringify(['Seed', 'Series A', 'Fintech']),
          bio: 'Looking for early-stage fintech startups with strong technical founders.'
        },
        {
          name: 'Sarah Chen',
          role: 'Angel Investor',
          investments: 8,
          avatar: '/sarah_chen.png', 
          online: false,
          tags: JSON.stringify(['Pre-Seed', 'Seed', 'AI']),
          bio: 'Former founder turned investor. Passionate about AI/ML applications in healthcare.'
        },
        {
          name: 'David Smith',
          role: 'Managing Partner',
          investments: 24,
          avatar: '/david_smith.png',
          online: true,
          tags: JSON.stringify(['Series A', 'Series B', 'SaaS']),
          bio: 'We invest in B2B SaaS companies with proven product-market fit.'
        },
        {
          name: 'Elena Rostova',
          role: 'Venture Capitalist',
          investments: 15,
          avatar: '',
          online: false,
          tags: JSON.stringify(['Seed', 'Consumer', 'Web3']),
          bio: 'Investing in the next generation of consumer internet platforms.'
        }
      ];

      for (const inv of seedData) {
        await pool.query(
          'INSERT INTO investors (name, role, investments, avatar, online, tags, bio) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [inv.name, inv.role, inv.investments, inv.avatar, inv.online, inv.tags, inv.bio]
        );
      }
      
      // Seed Conversations & Messages
      console.log('🌱 Seeding database with conversations and messages...');
      const [convResult] = await pool.query(
        'INSERT INTO conversations (name, avatar, last_message, time, unread, online) VALUES (?, ?, ?, ?, ?, ?)',
        ['Michael Rodriguez', '/michael_rodriguez.png', "Let's schedule a call for next week to discuss the terms.", '10:42 AM', 2, true]
      );
      const convId = convResult.insertId;
      await pool.query('INSERT INTO messages (conversation_id, sender, text, time, isMe) VALUES (?, ?, ?, ?, ?)', [convId, 'Michael Rodriguez', 'Hi Zamin, I reviewed your profile and the latest pitch deck.', '10:30 AM', false]);
      await pool.query('INSERT INTO messages (conversation_id, sender, text, time, isMe) VALUES (?, ?, ?, ?, ?)', [convId, 'Zamin Shah', 'Thanks Michael! I appreciate you taking the time. Let me know if you have any questions.', '10:35 AM', true]);
      await pool.query('INSERT INTO messages (conversation_id, sender, text, time, isMe) VALUES (?, ?, ?, ?, ?)', [convId, 'Michael Rodriguez', "I do have a few questions regarding your go-to-market strategy in Q3. Let's schedule a call for next week to discuss the terms.", '10:42 AM', false]);

      await pool.query('INSERT INTO conversations (name, avatar, last_message, time, unread, online) VALUES (?, ?, ?, ?, ?, ?)', ['Sarah Chen', '/sarah_chen.png', 'The pitch deck looks solid. Do you have financial projections?', 'Yesterday', 0, false]);
      await pool.query('INSERT INTO conversations (name, avatar, last_message, time, unread, online) VALUES (?, ?, ?, ?, ?, ?)', ['David Smith', '/david_smith.png', 'Thanks for reaching out! I will review and get back.', 'Mon', 0, true]);

      // Seed Notifications
      console.log('🌱 Seeding database with notifications...');
      await pool.query('INSERT INTO notifications (type, title, description, time, unread, icon, iconColor) VALUES (?, ?, ?, ?, ?, ?, ?)', ['connection', 'New Connection Request', 'Sarah Chen has requested to connect with you.', '10 mins ago', true, 'UserPlus', 'blue']);
      await pool.query('INSERT INTO notifications (type, title, description, time, unread, icon, iconColor) VALUES (?, ?, ?, ?, ?, ?, ?)', ['view', 'Profile Viewed', 'Your startup profile was viewed by Horizon Ventures.', '2 hours ago', true, 'Eye', 'purple']);
      await pool.query('INSERT INTO notifications (type, title, description, time, unread, icon, iconColor) VALUES (?, ?, ?, ?, ?, ?, ?)', ['message', 'New Message', 'Michael Rodriguez sent you a message regarding your pitch deck.', 'Yesterday at 10:42 AM', false, 'MessageSquare', 'green']);
      await pool.query('INSERT INTO notifications (type, title, description, time, unread, icon, iconColor) VALUES (?, ?, ?, ?, ?, ?, ?)', ['system', 'Account Verified', 'Your startup profile has been successfully verified by our team.', '2 days ago', false, 'CheckCircle', 'amber']);

      // Seed Documents
      console.log('🌱 Seeding database with documents...');
      await pool.query('INSERT INTO documents (name, type, size, date, icon, color) VALUES (?, ?, ?, ?, ?, ?)', ['Nexus_AI_Pitch_Deck_v2.pdf', 'presentation', '4.2 MB', 'Oct 24, 2023', 'FileText', 'blue']);
      await pool.query('INSERT INTO documents (name, type, size, date, icon, color) VALUES (?, ?, ?, ?, ?, ?)', ['Financial_Projections_2024.xlsx', 'spreadsheet', '1.8 MB', 'Oct 22, 2023', 'FileBarChart', 'green']);
      await pool.query('INSERT INTO documents (name, type, size, date, icon, color) VALUES (?, ?, ?, ?, ?, ?)', ['Term_Sheet_Draft.pdf', 'document', '845 KB', 'Oct 15, 2023', 'FileText', 'purple']);
      await pool.query('INSERT INTO documents (name, type, size, date, icon, color) VALUES (?, ?, ?, ?, ?, ?)', ['Executive_Summary.pdf', 'document', '1.2 MB', 'Sep 30, 2023', 'FileText', 'amber']);

      console.log('✅ Dummy data seeded successfully!');
    }

  } catch (err) {
    console.error('❌ Failed to setup tables/seed:', err.message);
  }
}

// Initialize Database
initDb();

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Serve static frontend files
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to React index.html for non-API routes
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Nexus Platform API is running' });
});

// Route to get all investors (with optional search)
app.get('/api/investors', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  
  const search = req.query.q || '';
  const excludeId = req.query.exclude || 0;
  const searchPattern = `%${search}%`;
  
  try {
    // Combine investors table and users table
    const query = `
      (SELECT id, name, role, investments, avatar, online, tags, bio, 'investor' as source 
       FROM investors 
       WHERE name LIKE ? OR role LIKE ? OR IFNULL(bio, '') LIKE ?)
      UNION
      (SELECT id, name, 'Nexus Member' as role, 0 as investments, NULL as avatar, 1 as online, '["Member"]' as tags, bio, 'user' as source 
       FROM users 
       WHERE name LIKE ? OR IFNULL(bio, '') LIKE ?)
      ORDER BY name ASC
    `;
    
    const [rows] = await pool.query(query, [
      searchPattern, searchPattern, searchPattern,
      searchPattern, searchPattern
    ]);
    
    console.log(`Found ${rows.length} results (Investors + Users)`);
    
    // Parse the JSON tags back into arrays for the frontend
    const investors = rows.map(inv => ({
      ...inv,
      tags: typeof inv.tags === 'string' ? JSON.parse(inv.tags) : (inv.tags || []),
      online: !!inv.online // Convert to boolean
    }));
    
    res.json(investors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch investors', details: error.message });
  }
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'nexus_super_secret_key_2026';

// Middleware for auth (Mock implementation)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Route to handle login
app.post('/api/auth/login', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  const { email, password } = req.body;
  
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length > 0) {
      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      
      // Fallback for unhashed seeded users
      const isValid = match || password === user.password;
      
      if (isValid) {
        // Don't send password back
        delete user.password;
        
        // Parse JSON fields
        user.history = typeof user.history === 'string' ? JSON.parse(user.history) : user.history;
        user.preferences = typeof user.preferences === 'string' ? JSON.parse(user.preferences) : user.preferences;
        
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        
        res.json({ success: true, user, token });
      } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Route to handle signup
app.post('/api/auth/signup', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  const { name, email, password } = req.body;
  
  try {
    // Check if user exists
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    
    res.json({ success: true, userId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed', details: error.message });
  }
});

// Route to update profile
app.post('/api/profile/update', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  const { userId, bio, history, preferences } = req.body;
  
  try {
    await pool.query(
      'UPDATE users SET bio = ?, history = ?, preferences = ? WHERE id = ?',
      [bio, JSON.stringify(history), JSON.stringify(preferences), userId]
    );
    
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Update failed', details: error.message });
  }
});

// Dynamic Features APIs

// Get stats
app.get('/api/stats', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  try {
    const [invRows] = await pool.query('SELECT COUNT(*) as count FROM investors');
    const [notifRows] = await pool.query('SELECT COUNT(*) as count FROM notifications WHERE unread = true');
    const [convRows] = await pool.query('SELECT COUNT(*) as count FROM conversations');
    res.json({
      total_connections: invRows[0].count,
      pending_requests: notifRows[0].count,
      upcoming_meetings: 2,
      profile_views: 24
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
  }
});

// Get conversations
app.get('/api/conversations', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  try {
    const [rows] = await pool.query('SELECT * FROM conversations ORDER BY id DESC');
    res.json(rows.map(row => ({...row, online: !!row.online})));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages for a conversation
app.get('/api/messages/:conversationId', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  try {
    const [rows] = await pool.query('SELECT * FROM messages WHERE conversation_id = ? ORDER BY id ASC', [req.params.conversationId]);
    res.json(rows.map(row => ({...row, isMe: !!row.isMe})));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
app.post('/api/messages', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  const { conversation_id, sender, text, time, isMe } = req.body;
  try {
    await pool.query('INSERT INTO messages (conversation_id, sender, text, time, isMe) VALUES (?, ?, ?, ?, ?)', [conversation_id, sender, text, time, isMe]);
    await pool.query('UPDATE conversations SET last_message = ?, time = ? WHERE id = ?', [text, time, conversation_id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get notifications
app.get('/api/notifications', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  try {
    const [rows] = await pool.query('SELECT * FROM notifications ORDER BY id DESC');
    res.json(rows.map(row => ({...row, unread: !!row.unread})));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark all notifications as read (support both paths)
app.post('/api/notifications/read', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  try {
    await pool.query('UPDATE notifications SET unread = false');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
});

app.post('/api/notifications/mark-read', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  try {
    await pool.query('UPDATE notifications SET unread = false');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
});

// Get documents
app.get('/api/documents', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  try {
    const [rows] = await pool.query('SELECT * FROM documents ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Multer document upload (Week 2 Chamber)
app.post('/api/documents/upload', upload.single('document'), async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
  const { originalname, size, filename } = req.file;
  const type = originalname.endsWith('.pdf') ? 'presentation' : 'document';
  const fileSize = (size / 1024 / 1024).toFixed(2) + ' MB';
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  
  try {
    const [result] = await pool.query(
      'INSERT INTO documents (name, type, size, date, icon, color) VALUES (?, ?, ?, ?, ?, ?)', 
      [originalname, type, fileSize, date, 'FileText', 'blue']
    );
    res.json({ success: true, id: result.insertId, file: filename });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload document to DB' });
  }
});

// Fallback old mock endpoint
app.post('/api/documents', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  const { name, type, size } = req.body;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  try {
    const [result] = await pool.query('INSERT INTO documents (name, type, size, date) VALUES (?, ?, ?, ?)', [name, type || 'document', size || '1.0 MB', date]);
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// Delete a document
app.delete('/api/documents/:id', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  try {
    await pool.query('DELETE FROM documents WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// --- WEEK 2 & 3 FEATURES ---

// Get Meetings
app.get('/api/meetings', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  try {
    const [rows] = await pool.query('SELECT * FROM meetings ORDER BY id DESC');
    res.json(rows.map(r => ({ ...r, participants: typeof r.participants === 'string' ? JSON.parse(r.participants) : r.participants })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
});

// Schedule Meeting
app.post('/api/meetings', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  const { title, date, time, participants } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO meetings (title, date, time, participants, status) VALUES (?, ?, ?, ?, ?)', 
      [title, date, time, JSON.stringify(participants), 'Pending']
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to schedule meeting' });
  }
});

// Accept/Reject Meeting
app.put('/api/meetings/:id', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  const { status } = req.body; // 'Accepted' or 'Rejected'
  try {
    await pool.query('UPDATE meetings SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update meeting' });
  }
});

// Get Transactions (Payments)
app.get('/api/payments/transactions', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  const userId = req.query.userId || 1;
  try {
    const [rows] = await pool.query('SELECT * FROM transactions WHERE user_id = ? ORDER BY id DESC', [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create Transaction
app.post('/api/payments/transaction', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not connected' });
  const { userId, amount, type } = req.body; // type: Deposit, Withdraw, Transfer
  const date = new Date().toLocaleString();
  try {
    const [result] = await pool.query(
      'INSERT INTO transactions (user_id, amount, type, status, date) VALUES (?, ?, ?, ?, ?)', 
      [userId || 1, amount, type, 'Completed', date]
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Transaction failed' });
  }
});

// Socket.IO for Video Calling
io.on('connection', (socket) => {
  console.log('User connected for video call:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
