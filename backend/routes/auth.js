const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }
  
  try {
    // Check if user already exists
    db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (user) {
        return res.status(400).json({ error: 'User already exists with that email or username' });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create new user
      const now = new Date().toISOString();
      db.run(
        'INSERT INTO users (username, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, now, now],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          // Create user profile
          db.run(
            'INSERT INTO user_profiles (user_id, display_name) VALUES (?, ?)',
            [this.lastID, username],
            function(err) {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              
              // Generate JWT token
              const token = jwt.sign(
                { id: this.lastID, username, email },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRY }
              );
              
              res.status(201).json({
                message: 'User registered successfully',
                token,
                user: {
                  id: this.lastID,
                  username,
                  email
                }
              });
            }
          );
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  try {
    // Find user by email
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
      
      // Check password
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
      
      // Get user profile
      db.get('SELECT * FROM user_profiles WHERE user_id = ?', [user.id], (err, profile) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, username: user.username, email: user.email },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRY }
        );
        
        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            displayName: profile ? profile.display_name : user.username,
            avatar: profile ? profile.avatar_url : null
          }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user data
    db.get('SELECT id, username, email FROM users WHERE id = ?', [decoded.id], (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Get user profile
      db.get('SELECT * FROM user_profiles WHERE user_id = ?', [user.id], (err, profile) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        res.json({
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            displayName: profile ? profile.display_name : user.username,
            avatar: profile ? profile.avatar_url : null
          }
        });
      });
    });
  } catch (error) {
    res.status(403).json({ error: 'Invalid token.' });
  }
});

module.exports = router;
