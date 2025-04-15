const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');
const fs = require('fs');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token.' });
    }
    
    req.user = user;
    next();
  });
};

// Get all audio resources
router.get('/', (req, res) => {
  const { category } = req.query;
  
  let query = 'SELECT * FROM audio_resources';
  let params = [];
  
  if (category && category !== 'all') {
    query += ' WHERE protocol_type = ?';
    params.push(category);
  }
  
  query += ' ORDER BY title ASC';
  
  db.all(query, params, (err, resources) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ resources });
  });
});

// Get a specific audio resource
router.get('/:id', (req, res) => {
  const resourceId = req.params.id;
  
  db.get(
    'SELECT * FROM audio_resources WHERE id = ?',
    [resourceId],
    (err, resource) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      
      res.json({ resource });
    }
  );
});

// Create a new audio resource (admin only)
router.post('/', authenticateToken, (req, res) => {
  const { title, description, protocolType, durationSeconds, filePath } = req.body;
  
  // Validate input
  if (!title || !protocolType || !durationSeconds || !filePath) {
    return res.status(400).json({ error: 'Title, protocol type, duration, and file path are required' });
  }
  
  // Check if user is admin (simplified check - in a real app, would check admin role)
  if (req.user.id !== 1) {
    return res.status(403).json({ error: 'Only administrators can add audio resources' });
  }
  
  db.run(
    `INSERT INTO audio_resources
     (title, description, protocol_type, duration_seconds, file_path)
     VALUES (?, ?, ?, ?, ?)`,
    [title, description || '', protocolType, durationSeconds, filePath],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.status(201).json({
        message: 'Audio resource created successfully',
        resource: {
          id: this.lastID,
          title,
          description: description || '',
          protocol_type: protocolType,
          duration_seconds: durationSeconds,
          file_path: filePath
        }
      });
    }
  );
});

// Update an audio resource (admin only)
router.put('/:id', authenticateToken, (req, res) => {
  const resourceId = req.params.id;
  const { title, description, protocolType, durationSeconds, filePath } = req.body;
  
  // Validate input
  if (!title || !protocolType || !durationSeconds || !filePath) {
    return res.status(400).json({ error: 'Title, protocol type, duration, and file path are required' });
  }
  
  // Check if user is admin (simplified check - in a real app, would check admin role)
  if (req.user.id !== 1) {
    return res.status(403).json({ error: 'Only administrators can update audio resources' });
  }
  
  db.run(
    `UPDATE audio_resources
     SET title = ?, description = ?, protocol_type = ?, duration_seconds = ?, file_path = ?
     WHERE id = ?`,
    [title, description || '', protocolType, durationSeconds, filePath, resourceId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      
      res.json({
        message: 'Audio resource updated successfully',
        resource: {
          id: resourceId,
          title,
          description: description || '',
          protocol_type: protocolType,
          duration_seconds: durationSeconds,
          file_path: filePath
        }
      });
    }
  );
});

// Delete an audio resource (admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  const resourceId = req.params.id;
  
  // Check if user is admin (simplified check - in a real app, would check admin role)
  if (req.user.id !== 1) {
    return res.status(403).json({ error: 'Only administrators can delete audio resources' });
  }
  
  db.run(
    'DELETE FROM audio_resources WHERE id = ?',
    [resourceId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      
      res.json({
        message: 'Audio resource deleted successfully'
      });
    }
  );
});

// Serve audio files
router.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const audioDir = path.join(__dirname, '..', 'public', 'audio');
  const filePath = path.join(audioDir, filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Audio file not found' });
  }
  
  // Serve the file
  res.sendFile(filePath);
});

module.exports = router;
