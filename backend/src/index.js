
import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import multer from 'multer';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { User, Message, sequelize } from './models/index.js';
import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from './validation/user.js';
import { handleSocketConnection } from './socket/socketHandler.js';
import crypto from 'crypto';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:8080'],
    methods: ['GET', 'POST']
  }
});
const port = 3001;
const upload = multer({ dest: 'uploads/' });

// Initialize Socket.io
handleSocketConnection(io);

// Security middleware
app.use(helmet());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:8080'], credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);


app.get('/', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ message: 'Server is running', time: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Signup endpoint
app.post('/signup', authLimiter, async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error && parsed.error.errors ? parsed.error.errors.map(e => e.message).join(', ') : 'Invalid input';
      return res.status(400).json({ error: errorMsg });
    }
    const { username, email, displayName, password } = parsed.data;
    const existing = await User.findOne({ where: { [sequelize.Sequelize.Op.or]: [{ username }, { email }] } });
    if (existing) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, displayName, password: hashedPassword, isVerified: false });
    
    // Send confirmation email
    try {
      const { sendConfirmationEmail } = await import('./lib/mailer.js');
      await sendConfirmationEmail(user.email, user.displayName, user.id);
    } catch (mailErr) {
      console.error('Email error:', mailErr);
    }
    
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
    res.status(201).json({ user: { id: user.id, username: user.username, email: user.email, displayName: user.displayName }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Email verification endpoint
app.get('/verify', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Missing token');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).send('User not found');
    if (user.isVerified) return res.send('Email already verified');
    user.isVerified = true;
    await user.save();
    res.send('Email verified! You can now log in.');
  } catch (err) {
    res.status(400).send('Invalid or expired token');
  }
});

// Login endpoint
app.post('/login', authLimiter, async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error && parsed.error.errors ? parsed.error.errors.map(e => e.message).join(', ') : 'Invalid input';
      return res.status(400).json({ error: errorMsg });
    }
    const { username, email, password } = parsed.data;
    let user = null;
    if (username && email) {
      user = await User.findOne({ where: { [sequelize.Sequelize.Op.or]: [{ username }, { email }], isVerified: true } });
    } else if (username) {
      user = await User.findOne({ where: { username, isVerified: true } });
    } else if (email) {
      user = await User.findOne({ where: { email, isVerified: true } });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials or email not verified' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
    res.json({ user: { id: user.id, username: user.username, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Get user profile
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'displayName', 'isVerified', 'avatar', 'bio']
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile (displayName, username, email, status, contactNumber, avatar, bio)
app.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { displayName, username, email, status, contactNumber, avatar, bio } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (displayName) user.displayName = displayName;
    if (username) user.username = username;
    if (email) user.email = email;
    if (status) user.status = status;
    if (contactNumber) user.contactNumber = contactNumber;
    if (avatar) user.avatar = avatar;
    if (bio) user.bio = bio;
    await user.save();
    res.json({ user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      status: user.status,
      contactNumber: user.contactNumber,
      avatar: user.avatar,
      bio: user.bio
    }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload profile photo
app.post('/profile/photo', authenticateToken, upload.single('photo'), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
      await user.save();
      res.json({ avatar: user.avatar });
    } else {
      res.status(400).json({ error: 'No file uploaded' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change password
app.put('/profile/password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(401).json({ error: 'Old password incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot password endpoint
app.post('/forgot-password', authLimiter, async (req, res) => {
  try {
    console.log('Forgot password request received:', req.body);
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log('Validation error:', parsed.error.errors);
      const errorMsg = parsed.error && parsed.error.errors ? parsed.error.errors.map(e => e.message).join(', ') : 'Invalid input';
      return res.status(400).json({ error: errorMsg });
    }
    const { email } = parsed.data;
    console.log('Looking for user with email:', email);

    const user = await User.findOne({ where: { email, isVerified: true } });
    console.log('User found:', !!user);
    if (!user) {
      // Don't reveal if email exists for security
      console.log('No verified user found with email:', email);
      return res.json({ message: 'If an account with that email exists, we sent a password reset link.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Send reset email
    console.log('Attempting to send password reset email to:', user.email);
    try {
      const { sendPasswordResetEmail } = await import('./lib/mailer.js');
      await sendPasswordResetEmail(user.email, user.displayName, resetToken);
      console.log('Password reset email sent successfully to:', user.email);
    } catch (mailErr) {
      console.error('Password reset email error:', mailErr);
      return res.status(500).json({ error: 'Failed to send reset email' });
    }

    res.json({ message: 'If an account with that email exists, we sent a password reset link.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset password endpoint
app.post('/reset-password', authLimiter, async (req, res) => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMsg = parsed.error && parsed.error.errors ? parsed.error.errors.map(e => e.message).join(', ') : 'Invalid input';
      return res.status(400).json({ error: errorMsg });
    }
    const { token, newPassword } = parsed.data;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [sequelize.Sequelize.Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in with your new password.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Message endpoints
// Get messages for a conversation
app.get('/messages/:receiverId', authenticateToken, async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const messages = await Message.findAll({
      where: {
        [sequelize.Sequelize.Op.or]: [
          { senderId: req.user.id, receiverId: parseInt(receiverId) },
          { senderId: parseInt(receiverId), receiverId: req.user.id }
        ]
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'displayName', 'avatar'] },
        { model: User, as: 'receiver', attributes: ['id', 'username', 'displayName'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({ messages: messages.reverse(), hasMore: messages.length === parseInt(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send message (REST endpoint as backup to Socket.io)
app.post('/messages', authenticateToken, async (req, res) => {
  try {
    const { content, receiverId, groupId } = req.body;

    const message = await Message.create({
      content,
      senderId: req.user.id,
      receiverId: receiverId || null,
      groupId: groupId || null,
      messageType: 'text'
    });

    const messageWithSender = await Message.findByPk(message.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'displayName', 'avatar'] },
        { model: User, as: 'receiver', attributes: ['id', 'username', 'displayName'] }
      ]
    });

    res.json(messageWithSender);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users (for contacts/user list)
app.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        id: { [sequelize.Sequelize.Op.ne]: req.user.id }, // Exclude current user
        isVerified: true
      },
      attributes: ['id', 'username', 'displayName', 'avatar', 'status'],
      order: [['displayName', 'ASC']]
    });

    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all conversations for a user
app.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const conversations = await Message.findAll({
      where: {
        [sequelize.Sequelize.Op.or]: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'displayName', 'avatar'] },
        { model: User, as: 'receiver', attributes: ['id', 'username', 'displayName', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 1,
      group: [
        sequelize.Sequelize.literal(`CASE 
          WHEN "senderId" = ${req.user.id} THEN "receiverId" 
          ELSE "senderId" 
        END`),
        'Message.id', 'sender.id', 'receiver.id'
      ]
    });

    // Process conversations to get unique users
    const uniqueConversations = new Map();
    conversations.forEach(msg => {
      const otherUserId = msg.senderId === req.user.id ? msg.receiverId : msg.senderId;
      const otherUser = msg.senderId === req.user.id ? msg.receiver : msg.sender;
      
      if (!uniqueConversations.has(otherUserId)) {
        uniqueConversations.set(otherUserId, {
          user: otherUser,
          lastMessage: msg,
          lastMessageTime: msg.createdAt
        });
      }
    });

    res.json(Array.from(uniqueConversations.values()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

server.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
