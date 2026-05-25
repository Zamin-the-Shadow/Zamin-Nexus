# Nexus Platform API Documentation

Base URL: `http://localhost:5000`

## Authentication

### POST `/api/auth/signup`
Creates a new user.
- **Body:** `{ "name": "John Doe", "email": "john@example.com", "password": "securepass" }`
- **Response:** `{ "success": true, "userId": 1 }`

### POST `/api/auth/login`
Authenticates a user and returns a JWT.
- **Body:** `{ "email": "john@example.com", "password": "securepass" }`
- **Response:** `{ "success": true, "user": { ... }, "token": "jwt_token_string" }`

---

## Documents (Document Chamber)

### GET `/api/documents`
Fetch all uploaded documents.
- **Response:** `[ { "id": 1, "name": "Pitch.pdf", "type": "presentation", ... } ]`

### POST `/api/documents/upload`
Upload a real document file using `multipart/form-data`.
- **Body:** FormData containing `document` (File)
- **Response:** `{ "success": true, "id": 5, "file": "document-1234.pdf" }`

### DELETE `/api/documents/:id`
Deletes a document by ID.
- **Response:** `{ "success": true }`

---

## Meetings

### GET `/api/meetings`
Fetch all scheduled meetings.
- **Response:** `[ { "id": 1, "title": "Pitch Review", "date": "2026-06-01", "status": "Pending" } ]`

### POST `/api/meetings`
Schedule a new meeting.
- **Body:** `{ "title": "Pitch Review", "date": "2026-06-01", "time": "14:00", "participants": ["Sarah Chen"] }`
- **Response:** `{ "success": true, "id": 1 }`

### PUT `/api/meetings/:id`
Update a meeting's status (Accept/Reject).
- **Body:** `{ "status": "Accepted" }`
- **Response:** `{ "success": true }`

---

## Payments

### GET `/api/payments/transactions?userId=1`
Fetch a user's transaction history.
- **Response:** `[ { "id": 1, "amount": "5000.00", "type": "Deposit", "status": "Completed" } ]`

### POST `/api/payments/transaction`
Create a new transaction (Deposit, Withdraw, Transfer).
- **Body:** `{ "userId": 1, "amount": 5000, "type": "Deposit" }`
- **Response:** `{ "success": true, "id": 1 }`

---

## Stats & Notifications

### GET `/api/stats`
Fetch dashboard statistics.
- **Response:** `{ "total_connections": 4, "pending_requests": 2, "upcoming_meetings": 2, "profile_views": 24 }`

### GET `/api/notifications`
Fetch all notifications.
- **Response:** `[ { "id": 1, "type": "message", "title": "New Message", ... } ]`

### POST `/api/notifications/mark-read`
Mark all notifications as read.
- **Response:** `{ "success": true }`
