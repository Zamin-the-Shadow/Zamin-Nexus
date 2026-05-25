import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  MessageCircle,
  Bell,
  FileText,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
  User,
  PlusCircle,
  TrendingUp,
  Calendar,
  AlertCircle,
  MapPin,
  Briefcase,
  Target,
  Edit,
  Search,
  Filter,
  Mail,
  ExternalLink,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  UserPlus,
  MessageSquare,
  Eye,
  CheckCircle,
  Clock,
  Check,
  UploadCloud,
  FileBarChart,
  Download,
  Trash2,
  Save,
  Shield,
  ChevronDown,
  BookOpen,
  LifeBuoy,
  PhoneCall,
  Moon,
  Sun,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import './index.css';

/* ─────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'my-startup',  label: 'My Startup',     icon: Building2 },
  { id: 'investors',   label: 'Find Investors', icon: Users },
  { id: 'meetings',    label: 'Meetings',       icon: Calendar },
  { id: 'messages',    label: 'Messages',       icon: MessageCircle },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'documents',   label: 'Documents',      icon: FileText },
  { id: 'payments',    label: 'Payments',       icon: Briefcase },
];

const SETTINGS_ITEMS = [
  { id: 'settings',  label: 'Settings',      icon: SettingsIcon },
  { id: 'help',      label: 'Help & Support', icon: HelpCircle },
];

const TOPBAR_NAV = [
  { id: 'dashboard',     label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'messages',      label: 'Messages',     icon: MessageCircle },
  { id: 'notifications', label: 'Notifications',icon: Bell },
  { id: 'profile',       label: 'Profile',      icon: User },
];

const STATS = [
  {
    id: 'pending',
    label: 'Pending\nRequests',
    value: 0,
    iconColor: 'blue',
    labelColor: '',
    Icon: Bell,
  },
  {
    id: 'connections',
    label: 'Total\nConnections',
    value: 0,
    iconColor: 'green',
    labelColor: 'green',
    Icon: Users,
  },
  {
    id: 'meetings',
    label: 'Upcoming\nMeetings',
    value: 2,
    iconColor: 'amber',
    labelColor: 'amber',
    Icon: Calendar,
  },
  {
    id: 'views',
    label: 'Profile Views',
    value: 24,
    iconColor: 'purple',
    labelColor: 'purple',
    Icon: TrendingUp,
  },
];

const INVESTORS = [
  {
    id: 1,
    name: 'Michael Rodriguez',
    role: 'Investor',
    investments: 12,
    avatar: '/michael_rodriguez.png',
    online: true,
    tags: ['Seed', 'Series A'],
  },
];

/* ─────────────────────────────────────────────────────
   LOGIN / SIGNUP PAGE
───────────────────────────────────────────────────── */
function Auth({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
    const payload = isSignup ? { name, email, password } : { email, password };

    try {
      const response = await fetch(`${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        if (isSignup) {
          // After signup, automatically log them in or switch to login
          setIsSignup(false);
          setError('Account created! Please login.');
        } else {
          onLogin(data.user);
        }
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="topbar-logo-icon" style={{ margin: '0 auto 16px', width: '48px', height: '48px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
          <p>{isSignup ? 'Join the Nexus platform today' : 'Login to manage your startup'}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your name" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Processing...' : (isSignup ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="auth-footer">
          {isSignup ? (
            <p>Already have an account? <button onClick={() => setIsSignup(false)}>Log in</button></p>
          ) : (
            <p>Don't have an account? <button onClick={() => setIsSignup(true)}>Sign up</button></p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   TOP BAR
───────────────────────────────────────────────────── */
function TopBar({ activeNav, setActiveNav, user, onLogout, theme, onToggleTheme }) {
  return (
    <header className="topbar">
      {/* Logo */}
      <div className="topbar-logo" onClick={() => setActiveNav('dashboard')} style={{ cursor: 'pointer' }}>
        <div className="topbar-logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </div>
        Zamin Nexus
      </div>

      {/* Center Nav */}
      <nav className="topbar-nav">
        {TOPBAR_NAV.map(({ id, label, icon: Icon }) => {
          // Map 'profile' to 'my-startup' for navigation
          const targetId = id === 'profile' ? 'my-startup' : id;
          const isActive = activeNav === targetId;
          
          return (
            <button
              key={id}
              id={`topnav-${id}`}
              className={`topbar-nav-item${isActive ? ' active' : ''}`}
              onClick={() => setActiveNav(targetId)}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
        <button 
          id="topnav-logout" 
          className="topbar-nav-item logout"
          onClick={onLogout}
        >
          <LogOut size={16} />
          Logout
        </button>
      </nav>

      {/* Right */}
      <div className="topbar-right">
        <button 
          onClick={onToggleTheme}
          style={{ 
            background: 'var(--bg-main)', 
            border: '1px solid var(--border)', 
            padding: '8px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            marginRight: '8px'
          }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="topbar-avatar">{user?.name?.split(' ').map(n => n[0]).join('') || 'U'}</div>
        <span className="topbar-username">{user?.name || 'User'}</span>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────────────── */
function Sidebar({ active, setActive }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`sidebar-${id}`}
            className={`sidebar-item${active === id ? ' active' : ''}`}
            onClick={() => setActive(id)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}

        <div className="sidebar-section-label">SETTINGS</div>

        {SETTINGS_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`sidebar-${id}`}
            className={`sidebar-item${active === id ? ' active' : ''}`}
            onClick={() => setActive(id)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-text">Need assistance?</div>
        <div 
          className="sidebar-footer-link" 
          onClick={() => setActive('contact')}
        >
          Contact Support
        </div>
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────── */
function StatCard({ stat }) {
  const { label, value, iconColor, labelColor, Icon } = stat;
  return (
    <div className="stat-card">
      <div className={`stat-icon-wrap ${iconColor}`}>
        <Icon size={22} />
      </div>
      <div className="stat-info">
        <div className={`stat-label ${labelColor}`} style={{ whiteSpace: 'pre-line' }}>
          {label}
        </div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   COLLABORATION REQUESTS PANEL
───────────────────────────────────────────────────── */
function CollaborationRequests() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Collaboration Requests</h2>
        <span className="badge pending">0 pending</span>
      </div>
      <div className="panel-body">
        <div className="empty-state">
          <div className="empty-icon">
            <AlertCircle size={22} />
          </div>
          <div className="empty-title">No collaboration requests yet</div>
          <div className="empty-desc">
            When investors are interested in your startup, their requests will appear here
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   RECOMMENDED INVESTORS PANEL
───────────────────────────────────────────────────── */
function RecommendedInvestors({ setActiveNav, user }) {
  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    fetch('/api/investors')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInvestors(data.slice(0, 3));
        } else {
          setInvestors(INVESTORS);
        }
      })
      .catch(err => {
        console.error("Failed to fetch, using fallback data");
        setInvestors(INVESTORS);
      });
  }, []);

  return (
    <div className="panel investors-panel">
      <div className="panel-header">
        <h2 className="panel-title">Recommended<br />Investors</h2>
        <span 
          className="view-all" 
          onClick={() => setActiveNav('investors')}
          style={{ cursor: 'pointer' }}
        >
          View<br />all
        </span>
      </div>

      {investors.map((inv) => (
        <div key={inv.id} className="investor-card">
          <div className="investor-avatar-wrap">
            {inv.avatar ? (
              <img
                src={inv.avatar}
                alt={inv.name}
                className="investor-avatar"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              style={{
                display: inv.avatar ? 'none' : 'flex',
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {inv.name ? inv.name.split(' ').map(n => n[0]).join('') : 'U'}
            </div>
            {inv.online && <div className="investor-online" />}
          </div>

          <div className="investor-info">
            <div className="investor-name">{inv.name}</div>
            <div className="investor-meta">
              {inv.role} • {inv.investments} investments
            </div>
            <div className="investor-tags">
              {(inv.tags || []).map((tag) => (
                <span
                  key={tag}
                  className={`tag ${tag.toLowerCase().replace(' ', '-').replace('/', '-')}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   DASHBOARD PAGE
───────────────────────────────────────────────────── */
function Dashboard({ setActiveNav, user }) {
  const [stats, setStats] = useState(STATS);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setStats(prev => prev.map(s => {
            if (s.id === 'pending') return { ...s, value: data.pending_requests ?? s.value };
            if (s.id === 'connections') return { ...s, value: data.total_connections ?? s.value };
            if (s.id === 'meetings') return { ...s, value: data.upcoming_meetings ?? s.value };
            if (s.id === 'views') return { ...s, value: data.profile_views ?? s.value };
            return s;
          }));
        }
      })
      .catch(() => {}); // keep fallback values
  }, []);

  return (
    <main className="main-content">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome, {user?.name || 'User'}</h1>
          <p className="dashboard-subtitle">Here's what's happening with your startup today</p>
        </div>
        <button 
          id="btn-find-investors" 
          className="btn-find-investors"
          onClick={() => setActiveNav('investors')}
        >
          <PlusCircle size={16} />
          Find Investors
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Bottom panels */}
      <div className="bottom-grid">
        <CollaborationRequests />
        <RecommendedInvestors setActiveNav={setActiveNav} user={user} />
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────
   MY STARTUP PAGE
───────────────────────────────────────────────────── */
function MyStartup({ user }) {
  return (
    <main className="main-content">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Startup Profile</h1>
          <p className="dashboard-subtitle">Manage your startup details and visibility</p>
        </div>
        <button className="btn-find-investors" style={{ background: 'var(--bg-white)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
          <Edit size={16} />
          Edit Profile
        </button>
      </div>

      <div className="panel" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--primary-light)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '32px', fontWeight: 'bold' }}>
            {user?.name?.[0] || 'N'}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>{user?.name}'s Startup</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', marginBottom: '16px', maxWidth: '800px' }}>
              {user?.bio || "No bio added yet. Head to settings to complete your profile."}
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '14px' }}>
                <MapPin size={16} /> Location: Global
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '14px' }}>
                <Briefcase size={16} /> Industry: General
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '14px' }}>
                <Target size={16} /> Stage: Early Stage
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-grid">
         <div className="panel">
           <div className="panel-header">
             <h2 className="panel-title">Experience & History</h2>
           </div>
           <div className="panel-body" style={{ padding: '16px 20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Startup History</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{user?.history?.startups || 'No startup history provided.'}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Investment History</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{user?.history?.investments || 'No investment history provided.'}</p>
              </div>
           </div>
         </div>

         <div className="panel">
           <div className="panel-header">
             <h2 className="panel-title">Pitch Deck & Assets</h2>
           </div>
           <div className="panel-body">
             <div style={{ border: '1px dashed var(--border)', borderRadius: '8px', padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
               <FileText size={24} style={{ margin: '0 auto 8px', color: 'var(--text-muted)' }} />
               Upload your pitch deck (PDF)<br/>
               <button style={{ marginTop: '12px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '6px 12px', border: 'none', cursor: 'pointer', borderRadius: '6px', fontSize: '13px', fontWeight: '600' }}>Upload File</button>
             </div>
           </div>
         </div>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────
   FIND INVESTORS PAGE
───────────────────────────────────────────────────── */
const ALL_INVESTORS = [
  {
    id: 1,
    name: 'Michael Rodriguez',
    role: 'Partner at Horizon Ventures',
    investments: 12,
    avatar: '/michael_rodriguez.png',
    online: true,
    tags: ['Seed', 'Series A', 'Fintech'],
    bio: 'Looking for early-stage fintech startups with strong technical founders.',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Angel Investor',
    investments: 8,
    avatar: '/sarah_chen.png', 
    online: false,
    tags: ['Pre-Seed', 'Seed', 'AI'],
    bio: 'Former founder turned investor. Passionate about AI/ML applications in healthcare.',
  },
  {
    id: 3,
    name: 'David Smith',
    role: 'Managing Partner',
    investments: 24,
    avatar: '/david_smith.png',
    online: true,
    tags: ['Series A', 'Series B', 'SaaS'],
    bio: 'We invest in B2B SaaS companies with proven product-market fit.',
  },
  {
    id: 4,
    name: 'Elena Rostova',
    role: 'Venture Capitalist',
    investments: 15,
    avatar: '',
    online: false,
    tags: ['Seed', 'Consumer', 'Web3'],
    bio: 'Investing in the next generation of consumer internet platforms.',
  }
];

function FindInvestors({ user }) {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchInvestors = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/investors?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setInvestors(data);
        } else {
          // Fallback to local filtering if server error but returned object
          const filtered = ALL_INVESTORS.filter(inv => 
            inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.bio.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setInvestors(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch, using fallback data", err);
        const filtered = ALL_INVESTORS.filter(inv => 
          inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inv.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inv.bio.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setInvestors(filtered);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchInvestors();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <main className="main-content">
      <div className="dashboard-header" style={{ marginBottom: '16px' }}>
        <div>
          <h1 className="dashboard-title">Find Investors</h1>
          <p className="dashboard-subtitle">Discover and connect with the right investors for your startup</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by name, firm, or focus area..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 40px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none' }}
          />
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
          <Filter size={16} /> Filters
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
            Loading investors from Database...
          </div>
        ) : investors.map((inv) => (
          <div key={inv.id} className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div className="investor-avatar-wrap">
                {inv.avatar ? (
                  <img
                    src={inv.avatar}
                    alt={inv.name}
                    className="investor-avatar"
                    style={{ width: '56px', height: '56px' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  style={{
                    display: inv.avatar ? 'none' : 'flex',
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 20,
                  }}
                >
                  {inv.name ? inv.name.split(' ').map(n => n[0]).join('') : 'U'}
                </div>
                {inv.online && <div className="investor-online" style={{ width: '12px', height: '12px', bottom: '2px', right: '2px' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>{inv.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{inv.role}</p>
                <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {inv.investments} investments
                </div>
              </div>
            </div>
            
            <div style={{ padding: '0 20px 16px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px', height: '40px', overflow: 'hidden' }}>
                "{inv.bio}"
              </p>
              <div className="investor-tags">
                {(inv.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className={`tag ${tag.toLowerCase().replace(' ', '-').replace('/', '-')}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', display: 'flex', padding: '12px 20px', gap: '8px' }}>
              <button style={{ flex: 1, background: 'var(--primary-light)', color: 'var(--primary)', padding: '8px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Mail size={16} /> Connect
              </button>
              <button style={{ padding: '8px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────
   MESSAGES PAGE
───────────────────────────────────────────────────── */
const CONVERSATIONS = [
  {
    id: 1,
    name: 'Michael Rodriguez',
    avatar: '/michael_rodriguez.png',
    lastMessage: 'Let\'s schedule a call for next week to discuss the terms.',
    time: '10:42 AM',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Sarah Chen',
    avatar: '/sarah_chen.png',
    lastMessage: 'The pitch deck looks solid. Do you have financial projections?',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: 'David Smith',
    avatar: '/david_smith.png',
    lastMessage: 'Thanks for reaching out! I will review and get back.',
    time: 'Mon',
    unread: 0,
    online: true,
  }
];

const CHAT_HISTORY = [
  { id: 1, sender: 'Michael Rodriguez', text: 'Hi Zamin, I reviewed your profile and the latest pitch deck.', time: '10:30 AM', isMe: false },
  { id: 2, sender: 'Zamin Shah', text: 'Thanks Michael! I appreciate you taking the time. Let me know if you have any questions.', time: '10:35 AM', isMe: true },
  { id: 3, sender: 'Michael Rodriguez', text: 'I do have a few questions regarding your go-to-market strategy in Q3. Let\'s schedule a call for next week to discuss the terms.', time: '10:42 AM', isMe: false },
];

function Messages({ user }) {
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const chatEndRef = useState(null);

  // Fetch conversations
  useEffect(() => {
    fetch('/api/conversations')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setConversations(data);
          setActiveChat(data[0].id);
        } else {
          setConversations(CONVERSATIONS);
          setActiveChat(CONVERSATIONS[0].id);
        }
      })
      .catch(() => {
        setConversations(CONVERSATIONS);
        setActiveChat(CONVERSATIONS[0].id);
      });
  }, []);

  // Fetch messages for active chat
  useEffect(() => {
    if (!activeChat) return;
    setChatLoading(true);
    fetch(`/api/messages/${activeChat}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setChatMessages(data);
        else setChatMessages(CHAT_HISTORY);
      })
      .catch(() => setChatMessages(CHAT_HISTORY))
      .finally(() => setChatLoading(false));
  }, [activeChat]);

  const activeConv = conversations.find(c => c.id === activeChat);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeChat) return;
    setSending(true);
    const optimistic = {
      id: Date.now(),
      sender: user?.name || 'You',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };
    setChatMessages(prev => [...prev, optimistic]);
    setNewMessage('');
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: activeChat, sender: user?.name || 'You', text: newMessage, isMe: true }),
      });
    } catch {}
    setSending(false);
  };

  return (
    <main className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="dashboard-header" style={{ marginBottom: '16px', flexShrink: 0 }}>
        <div>
          <h1 className="dashboard-title">Messages</h1>
          <p className="dashboard-subtitle">Communicate directly with investors and founders</p>
        </div>
      </div>

      <div className="panel" style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: '0' }}>
        {/* Left Sidebar - Chat List */}
        <div style={{ width: '340px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--bg-white)', flexShrink: 0 }}>
          <div style={{ padding: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search messages..." 
                style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none', background: 'var(--bg-main)' }}
              />
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.map(conv => (
              <div 
                key={conv.id} 
                onClick={() => setActiveChat(conv.id)}
                style={{ 
                  padding: '16px', 
                  display: 'flex', 
                  gap: '12px', 
                  cursor: 'pointer',
                  background: activeChat === conv.id ? 'var(--primary-light)' : 'transparent',
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.2s'
                }}
              >
                <div className="investor-avatar-wrap" style={{ flexShrink: 0 }}>
                  <img
                    src={conv.avatar}
                    alt={conv.name}
                    className="investor-avatar"
                    style={{ width: '48px', height: '48px' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    style={{
                      display: 'none',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    {conv.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {conv.online && <div className="investor-online" style={{ width: '12px', height: '12px', bottom: '1px', right: '1px' }} />}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.name}</h4>
                    <span style={{ fontSize: '11px', color: conv.unread ? 'var(--primary)' : 'var(--text-muted)', fontWeight: conv.unread ? '600' : '400' }}>{conv.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '13px', color: conv.unread ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: conv.unread ? '500' : '400', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                      {conv.last_message || conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                      <span style={{ background: 'var(--primary)', color: 'white', fontSize: '11px', fontWeight: '700', padding: '2px 6px', borderRadius: '10px', marginLeft: '8px' }}>
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane - Chat Window */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-white)', minWidth: 0 }}>
          {/* Chat Header */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-primary)' }}>{activeConv?.name || 'Select a conversation'}</div>
              {activeConv?.online && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
                  Online
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)' }}>
              <button 
                onClick={() => window.open(`/video-call.html?room=chat-${activeChat}&mode=audio`, '_blank', 'width=400,height=600')}
                style={{ background: 'none', color: 'inherit', border: 'none', cursor: 'pointer' }}
                title="Start Voice Call"
              >
                <Phone size={18} />
              </button>
              <button 
                onClick={() => window.open(`/video-call.html?room=chat-${activeChat}`, '_blank')}
                style={{ background: 'none', color: 'inherit', border: 'none', cursor: 'pointer' }}
                title="Start Video Call"
              >
                <Video size={18} />
              </button>
              <button style={{ background: 'none', color: 'inherit', border: 'none', cursor: 'pointer' }}><MoreVertical size={18} /></button>
            </div>
          </div>

          {/* Chat History */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-main)' }}>
            {chatLoading ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>Loading messages...</div>
            ) : chatMessages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{ display: 'flex', gap: '8px', maxWidth: '75%', flexDirection: msg.isMe ? 'row-reverse' : 'row' }}>
                  {!msg.isMe && (
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                      {(msg.sender || 'U').split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div style={{ 
                    padding: '12px 16px', 
                    borderRadius: '16px',
                    borderBottomLeftRadius: msg.isMe ? '16px' : '4px',
                    borderBottomRightRadius: msg.isMe ? '4px' : '16px',
                    background: msg.isMe ? 'var(--primary)' : 'var(--bg-white)', 
                    color: msg.isMe ? 'white' : 'var(--text-primary)',
                    border: msg.isMe ? 'none' : '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {msg.text}
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', padding: msg.isMe ? '0 8px' : '0 48px' }}>
                  {msg.time}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-white)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '24px', padding: '8px 16px' }}>
              <button style={{ color: 'var(--text-muted)', background: 'none', display: 'flex', alignItems: 'center' }}>
                <Paperclip size={18} />
              </button>
              <input 
                type="text" 
                placeholder="Type your message..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '14px', color: 'var(--text-primary)' }}
              />
              <button 
                onClick={handleSend}
                disabled={sending || !newMessage.trim()}
                style={{ background: 'var(--primary)', color: 'white', width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', flexShrink: 0, opacity: sending || !newMessage.trim() ? 0.6 : 1, cursor: 'pointer' }}>
                <Send size={15} style={{ marginLeft: '-2px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────
   NOTIFICATIONS PAGE
───────────────────────────────────────────────────── */
const NOTIFICATIONS = [
  {
    id: 1,
    type: 'connection',
    title: 'New Connection Request',
    description: 'Sarah Chen has requested to connect with you.',
    time: '10 mins ago',
    unread: true,
    icon: UserPlus,
    iconColor: 'blue'
  },
  {
    id: 2,
    type: 'view',
    title: 'Profile Viewed',
    description: 'Your startup profile was viewed by Horizon Ventures.',
    time: '2 hours ago',
    unread: true,
    icon: Eye,
    iconColor: 'purple'
  },
  {
    id: 3,
    type: 'message',
    title: 'New Message',
    description: 'Michael Rodriguez sent you a message regarding your pitch deck.',
    time: 'Yesterday at 10:42 AM',
    unread: false,
    icon: MessageSquare,
    iconColor: 'green'
  },
  {
    id: 4,
    type: 'system',
    title: 'Account Verified',
    description: 'Your startup profile has been successfully verified by our team.',
    time: '2 days ago',
    unread: false,
    icon: CheckCircle,
    iconColor: 'amber'
  }
];

const ICON_MAP = { connection: UserPlus, view: Eye, message: MessageSquare, system: CheckCircle };
const COLOR_MAP = { connection: 'blue', view: 'purple', message: 'green', system: 'amber' };

function Notifications() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Map icon and color from type
          const mapped = data.map(n => ({
            ...n,
            icon: ICON_MAP[n.type] || Bell,
            iconColor: COLOR_MAP[n.type] || 'blue',
          }));
          setNotifications(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications/mark-read', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    } catch {}
  };

  return (
    <main className="main-content" style={{ padding: '28px 32px' }}>
      <div className="dashboard-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="dashboard-title">Notifications</h1>
          <p className="dashboard-subtitle">Stay updated on activity regarding your startup</p>
        </div>
        <button 
          onClick={markAllRead}
          style={{ background: 'var(--bg-white)', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'background 0.2s' }}>
          <Check size={16} /> Mark all as read
        </button>
      </div>

      <div className="panel" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading notifications...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifications.map((notif, index) => {
              const Icon = notif.icon || Bell;
              return (
                <div 
                  key={notif.id} 
                  style={{ 
                    display: 'flex', 
                    gap: '16px', 
                    padding: '20px 24px', 
                    borderBottom: index === notifications.length - 1 ? 'none' : '1px solid var(--border)',
                    background: notif.unread ? 'var(--primary-light)' : 'var(--bg-white)',
                    position: 'relative',
                    transition: 'background 0.2s'
                  }}
                >
                  {notif.unread && (
                    <div style={{ position: 'absolute', left: '0', top: '0', bottom: '0', width: '3px', background: 'var(--primary)' }} />
                  )}
                  
                  <div className={`stat-icon-wrap ${notif.iconColor}`} style={{ width: '42px', height: '42px', flexShrink: 0 }}>
                    <Icon size={20} />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {notif.title}
                    </h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: '1.5' }}>
                      {notif.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <Clock size={14} /> {notif.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────
   DOCUMENTS PAGE
───────────────────────────────────────────────────── */
const DOCUMENTS = [
  {
    id: 1,
    name: 'Nexus_AI_Pitch_Deck_v2.pdf',
    type: 'presentation',
    size: '4.2 MB',
    date: 'Oct 24, 2023',
    icon: FileText,
    color: 'blue'
  },
  {
    id: 2,
    name: 'Financial_Projections_2024.xlsx',
    type: 'spreadsheet',
    size: '1.8 MB',
    date: 'Oct 22, 2023',
    icon: FileBarChart,
    color: 'green'
  },
  {
    id: 3,
    name: 'Term_Sheet_Draft.pdf',
    type: 'document',
    size: '845 KB',
    date: 'Oct 15, 2023',
    icon: FileText,
    color: 'purple'
  },
  {
    id: 4,
    name: 'Executive_Summary.pdf',
    type: 'document',
    size: '1.2 MB',
    date: 'Sep 30, 2023',
    icon: FileText,
    color: 'amber'
  }
];

const DOC_ICON_MAP = { presentation: FileText, spreadsheet: FileBarChart, document: FileText };
const DOC_COLOR_MAP = { presentation: 'blue', spreadsheet: 'green', document: 'purple' };

function Documents() {
  const [documents, setDocuments] = useState(DOCUMENTS);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  const fetchDocs = () => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(d => ({
            ...d,
            icon: DOC_ICON_MAP[d.type] || FileText,
            color: DOC_COLOR_MAP[d.type] || 'blue',
            date: d.date || d.created_at,
          }));
          setDocuments(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this document?')) return;
    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch {}
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      setUploading(true);
      setUploadMsg('');
      
      const formData = new FormData();
      formData.append('document', file);
      
      try {
        const res = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          setUploadMsg('Document uploaded!');
          fetchDocs();
          setTimeout(() => setUploadMsg(''), 3000);
        }
      } catch (err) {
        setUploadMsg('Upload failed.');
      }
      setUploading(false);
    };
    input.click();
  };

  return (
    <main className="main-content" style={{ padding: '28px 32px' }}>
      <div className="dashboard-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="dashboard-title">Documents</h1>
          <p className="dashboard-subtitle">Manage your pitch decks, financials, and legal documents</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {uploadMsg && <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600' }}>{uploadMsg}</span>}
          <button 
            onClick={handleUpload}
            disabled={uploading}
            style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '9px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.2s', opacity: uploading ? 0.7 : 1 }}>
            <UploadCloud size={18} /> {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </div>

      <div className="panel">
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '24px', background: 'var(--bg-main)' }}>
          <div style={{ flex: 2, fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>File Name</div>
          <div style={{ flex: 1, fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date Uploaded</div>
          <div style={{ width: '100px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Size</div>
          <div style={{ width: '80px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</div>
        </div>
        
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading documents...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {documents.map((doc, index) => {
              const Icon = doc.icon || FileText;
              return (
                <div 
                  key={doc.id} 
                  style={{ 
                    display: 'flex', 
                    gap: '24px', 
                    padding: '16px 24px', 
                    borderBottom: index === documents.length - 1 ? 'none' : '1px solid var(--border)',
                    alignItems: 'center',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-main)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div className={`stat-icon-wrap ${doc.color}`} style={{ width: '36px', height: '36px', flexShrink: 0, borderRadius: '8px' }}>
                      <Icon size={18} />
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {doc.name}
                    </div>
                  </div>
                  
                  <div style={{ flex: 1, fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {doc.date}
                  </div>
                  
                  <div style={{ width: '100px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {doc.size}
                  </div>

                  <div style={{ width: '80px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                      <Download size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────
   SETTINGS PAGE
───────────────────────────────────────────────────── */
function Settings({ user, onUpdateProfile }) {
  const [bio, setBio] = useState(user?.bio || '');
  const [history, setHistory] = useState(user?.history || { startups: '', investments: '' });
  const [preferences, setPreferences] = useState(user?.preferences || { connections: true, messages: true });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          bio,
          history,
          preferences
        })
      });
      
      const data = await response.json();
      if (data.success) {
        onUpdateProfile({ ...user, bio, history, preferences });
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="main-content" style={{ padding: '28px 32px' }}>
      <div className="dashboard-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="dashboard-title">Settings</h1>
          <p className="dashboard-subtitle">Manage your account preferences and application settings</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {message && <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600' }}>{message}</span>}
          <button 
            onClick={handleSave}
            disabled={saving}
            style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '9px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.2s', opacity: saving ? 0.7 : 1 }}
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
        {/* Profile Settings */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--primary)" /> Profile Information
            </h2>
          </div>
          <div className="panel-body" style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Full Name</label>
                <input type="text" readOnly defaultValue={user?.name} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none', background: 'var(--bg-main)', color: 'var(--text-muted)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Email Address</label>
                <input type="email" readOnly defaultValue={user?.email} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none', background: 'var(--bg-main)', color: 'var(--text-muted)' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Bio</label>
              <textarea 
                rows="3" 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..." 
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none', background: 'var(--bg-main)', resize: 'vertical' }}
              ></textarea>
            </div>
          </div>
        </div>

        {/* History & Experience */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--primary)" /> Startup & Investment History
            </h2>
          </div>
          <div className="panel-body" style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Startup History</label>
                <textarea 
                  rows="4" 
                  value={history.startups}
                  onChange={(e) => setHistory({...history, startups: e.target.value})}
                  placeholder="e.g. Founder at Nexus AI (2023-Present)..." 
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none', background: 'var(--bg-main)', resize: 'vertical' }}
                ></textarea>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Investment History</label>
                <textarea 
                  rows="4" 
                  value={history.investments}
                  onChange={(e) => setHistory({...history, investments: e.target.value})}
                  placeholder="e.g. Angel investor in Fintech startups..." 
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none', background: 'var(--bg-main)', resize: 'vertical' }}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Preferences */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="var(--primary)" /> Preferences
            </h2>
          </div>
          <div className="panel-body" style={{ padding: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginBottom: '16px' }}>
              <input 
                type="checkbox" 
                checked={preferences.connections}
                onChange={(e) => setPreferences({...preferences, connections: e.target.checked})}
                style={{ marginTop: '4px', accentColor: 'var(--primary)', width: '16px', height: '16px' }} 
              />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>New Connections</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Receive an email when an investor wants to connect.</div>
              </div>
            </label>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={preferences.messages}
                onChange={(e) => setPreferences({...preferences, messages: e.target.checked})}
                style={{ marginTop: '4px', accentColor: 'var(--primary)', width: '16px', height: '16px' }} 
              />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Direct Messages</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Receive an email when you get a new message.</div>
              </div>
            </label>
          </div>
        </div>

      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────
   HELP & SUPPORT PAGE
───────────────────────────────────────────────────── */
const FAQS = [
  {
    id: 1,
    question: "How do I update my startup's pitch deck?",
    answer: "You can update your pitch deck by navigating to the Documents page and clicking 'Upload Document'. Ensure your file is in PDF format and under 10MB."
  },
  {
    id: 2,
    question: "How are recommended investors selected?",
    answer: "Our AI matchmaking algorithm suggests investors based on your startup's industry, funding stage, and the investor's past portfolio focus."
  },
  {
    id: 3,
    question: "Can I hide my profile from certain investors?",
    answer: "Yes, you can manage your visibility preferences in the Settings page under 'Security & Authentication' (coming soon). You can block specific firms or individuals."
  },
  {
    id: 4,
    question: "What happens when an investor sends a collaboration request?",
    answer: "You will receive an email notification and an alert in your Notifications tab. You can then choose to accept or decline the request from your Dashboard."
  }
];

function HelpSupport({ setActiveNav }) {
  const [openFaq, setOpenFaq] = useState(1);

  return (
    <main className="main-content" style={{ padding: '28px 32px' }}>
      <div className="dashboard-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="dashboard-title">Help & Support</h1>
          <p className="dashboard-subtitle">Get help with Zamin Nexus and find answers to common questions</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        {/* Main Content - FAQs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Search Help */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search for articles, guides, or FAQs..." 
              style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '15px', outline: 'none', background: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}
            />
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} color="var(--primary)" /> Frequently Asked Questions
              </h2>
            </div>
            <div className="panel-body" style={{ padding: '0' }}>
              {FAQS.map((faq, index) => (
                <div key={faq.id} style={{ borderBottom: index === FAQS.length - 1 ? 'none' : '1px solid var(--border)' }}>
                  <button 
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)' }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: '600' }}>{faq.question}</span>
                    <ChevronDown size={18} style={{ color: 'var(--text-muted)', transform: openFaq === faq.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {openFaq === faq.id && (
                    <div style={{ padding: '0 24px 20px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Contact Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="panel" style={{ padding: '24px', textAlign: 'center', background: 'linear-gradient(to bottom, var(--bg-white), var(--primary-light))' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <LifeBuoy size={24} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>Need more help?</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
              Our support team is available 24/7 to help you with any issues or questions.
            </p>
            <button 
              onClick={() => setActiveNav('contact')}
              style={{ width: '100%', background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 0', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}
            >
              Contact Support
            </button>
          </div>

          <div className="panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>Helpful Resources</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" style={{ fontSize: '14px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Platform Onboarding Guide</a>
              <a href="#" style={{ fontSize: '14px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Best Practices for Pitching</a>
              <a href="#" style={{ fontSize: '14px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Investor Matching Algorithms</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────
   CONTACT SUPPORT PAGE
───────────────────────────────────────────────────── */
function ContactSupport() {
  return (
    <main className="main-content" style={{ padding: '28px 32px' }}>
      <div className="dashboard-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="dashboard-title">Contact Support</h1>
          <p className="dashboard-subtitle">We're here to help. Send us a message and we'll get back to you shortly.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        {/* Contact Form */}
        <div className="panel" style={{ padding: '32px' }}>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Your Name</label>
                <input type="text" defaultValue="Zamin Shah" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none', background: 'var(--bg-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Email Address</label>
                <input type="email" defaultValue="zamin@nexusai.com" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none', background: 'var(--bg-main)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Subject</label>
              <select style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none', background: 'var(--bg-main)', color: 'var(--text-primary)', appearance: 'none' }}>
                <option>Technical Issue</option>
                <option>Billing Question</option>
                <option>Account Assistance</option>
                <option>General Inquiry</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Message</label>
              <textarea rows="6" placeholder="Describe how we can help you..." style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none', background: 'var(--bg-main)', resize: 'vertical' }}></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <button type="button" style={{ background: 'var(--bg-white)', color: 'var(--text-secondary)', border: '1px dashed var(--border)', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <Paperclip size={16} /> Attach Files
              </button>
              <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.2s' }}>
                <Send size={16} /> Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Contact Info Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '20px' }}>Contact Information</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '2px' }}>Email Support</div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>support@nexusai.com</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <PhoneCall size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '2px' }}>Phone Support</div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>+92 300 1234567</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '2px' }}>Operating Hours</div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>24/7 Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────
   MEETINGS
───────────────────────────────────────────────────── */
function Meetings({ user }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/meetings')
      .then(res => res.json())
      .then(data => {
        setMeetings(data);
        setLoading(false);
      });
  }, []);

  return (
    <main className="main-content">
      <div className="header">
        <div>
          <h2>Meeting Scheduling System</h2>
          <p className="subtitle">Manage your calendar and video calls</p>
        </div>
        <button className="btn-primary" onClick={() => alert('Scheduling mock')}>
          <Calendar size={16} /> Schedule Meeting
        </button>
      </div>
      
      <div className="panel" style={{ padding: '24px' }}>
        <h3>Upcoming Meetings</h3>
        {loading ? <p>Loading meetings...</p> : meetings.map(m => (
          <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{m.title}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{m.date} at {m.time}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', background: m.status === 'Accepted' ? 'var(--success-light)' : 'var(--warning-light)', color: m.status === 'Accepted' ? 'var(--success)' : 'var(--warning)' }}>
                {m.status}
              </span>
              <button className="btn-secondary" onClick={() => window.open('/video-call.html', '_blank')}>
                <Video size={16} /> Join Call
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────
   PAYMENTS
───────────────────────────────────────────────────── */
function Payments({ user }) {
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    fetch('/api/payments/transactions?userId=' + (user?.id || 1))
      .then(res => res.json())
      .then(data => setTransactions(data));
  }, [user]);

  return (
    <main className="main-content">
      <div className="header">
        <div>
          <h2>Payments & Transactions</h2>
          <p className="subtitle">Manage funds via mock Stripe/PayPal integration</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary"><ArrowDownLeft size={16} /> Deposit</button>
          <button className="btn-secondary"><ArrowUpRight size={16} /> Withdraw</button>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <Briefcase size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value" style={{ fontSize: '24px' }}>$12,450.00</div>
            <div className="stat-label">Available Balance</div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ padding: '24px' }}>
        <h3>Recent Transactions</h3>
        {transactions.length === 0 ? <p>No transactions yet.</p> : transactions.map(t => (
          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{t.type}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t.date}</div>
            </div>
            <div style={{ fontWeight: 600, color: t.type === 'Withdraw' ? 'var(--danger)' : 'var(--success)' }}>
              {t.type === 'Withdraw' ? '-' : '+'}${parseFloat(t.amount).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────────────── */
export default function App() {
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('nexus_theme') || 'light');

  // Load user from localStorage on init
  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexus_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('nexus_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      setUser(null);
      localStorage.removeItem('nexus_user');
      setActiveNav('dashboard');
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
  };

  return (
    <div className="app-layout">
      <TopBar 
        activeNav={activeNav} 
        setActiveNav={setActiveNav} 
        user={user} 
        onLogout={handleLogout} 
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className="body-layout">
        <Sidebar active={activeNav} setActive={setActiveNav} />
        {activeNav === 'dashboard' && <Dashboard setActiveNav={setActiveNav} user={user} />}
        {activeNav === 'my-startup' && <MyStartup user={user} />}
        {activeNav === 'investors' && <FindInvestors user={user} />}
        {activeNav === 'meetings' && <Meetings user={user} />}
        {activeNav === 'messages' && <Messages user={user} />}
        {activeNav === 'notifications' && <Notifications />}
        {activeNav === 'documents' && <Documents />}
        {activeNav === 'payments' && <Payments user={user} />}
        {activeNav === 'settings' && <Settings user={user} onUpdateProfile={handleUpdateProfile} />}
        {activeNav === 'help' && <HelpSupport setActiveNav={setActiveNav} />}
        {activeNav === 'contact' && <ContactSupport />}
        {activeNav !== 'dashboard' && activeNav !== 'my-startup' && activeNav !== 'investors' && activeNav !== 'meetings' && activeNav !== 'messages' && activeNav !== 'notifications' && activeNav !== 'documents' && activeNav !== 'payments' && activeNav !== 'settings' && activeNav !== 'help' && activeNav !== 'contact' && (
          <main className="main-content">
            <div className="empty-state" style={{ marginTop: '100px' }}>
               <h2 className="empty-title">Coming Soon</h2>
               <p className="empty-desc">This page is under construction.</p>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
