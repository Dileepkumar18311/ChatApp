
import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, sequelize } from './models/index.js';
import { signupSchema, loginSchema } from './validation/user.js';

const app = express();
const port = 3001;
const upload = multer({ dest: 'uploads/' });

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:8080'], credentials: true }));
app.use(express.json());


app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Signup endpoint
app.post('/signup', async (req, res) => {
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
// Email verification endpoint
app.get('/verify', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Missing token');
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
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
    const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1d' });
    res.status(201).json({ user: { id: user.id, username: user.username, email: user.email, displayName: user.displayName }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
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
    const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1d' });
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
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
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

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
