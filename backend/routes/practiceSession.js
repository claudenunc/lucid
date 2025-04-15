const express = require('express');
const router = express.Router();
const db = require('../db');

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

// Get all practice sessions for a user
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  db.all(
    `SELECT * FROM practice_sessions
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId],
    (err, sessions) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ sessions });
    }
  );
});

// Get a specific practice session
router.get('/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const sessionId = req.params.id;
  
  db.get(
    `SELECT * FROM practice_sessions
     WHERE id = ? AND user_id = ?`,
    [sessionId, userId],
    (err, session) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      
      res.json({ session });
    }
  );
});

// Create a new practice session
router.post('/', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { protocolType, protocolName, durationMinutes, effectivenessRating, notes } = req.body;
  
  // Validate input
  if (!protocolType || !protocolName || !durationMinutes) {
    return res.status(400).json({ error: 'Protocol type, name, and duration are required' });
  }
  
  const now = new Date().toISOString();
  
  db.run(
    `INSERT INTO practice_sessions
     (user_id, protocol_type, protocol_name, duration_minutes, effectiveness_rating, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, protocolType, protocolName, durationMinutes, effectivenessRating || 5, notes || '', now],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Update progress metrics
      updateProgressMetrics(userId, now.split('T')[0]);
      
      res.status(201).json({
        message: 'Practice session created successfully',
        session: {
          id: this.lastID,
          user_id: userId,
          protocol_type: protocolType,
          protocol_name: protocolName,
          duration_minutes: durationMinutes,
          effectiveness_rating: effectivenessRating || 5,
          notes: notes || '',
          created_at: now
        }
      });
    }
  );
});

// Update a practice session
router.put('/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const sessionId = req.params.id;
  const { protocolType, protocolName, durationMinutes, effectivenessRating, notes } = req.body;
  
  // Validate input
  if (!protocolType || !protocolName || !durationMinutes) {
    return res.status(400).json({ error: 'Protocol type, name, and duration are required' });
  }
  
  // Check if session exists and belongs to user
  db.get(
    'SELECT * FROM practice_sessions WHERE id = ? AND user_id = ?',
    [sessionId, userId],
    (err, session) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!session) {
        return res.status(404).json({ error: 'Session not found or unauthorized' });
      }
      
      db.run(
        `UPDATE practice_sessions
         SET protocol_type = ?, protocol_name = ?, duration_minutes = ?, 
         effectiveness_rating = ?, notes = ?
         WHERE id = ? AND user_id = ?`,
        [protocolType, protocolName, durationMinutes, effectivenessRating || 5, notes || '', sessionId, userId],
        (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          res.json({
            message: 'Practice session updated successfully',
            session: {
              id: sessionId,
              user_id: userId,
              protocol_type: protocolType,
              protocol_name: protocolName,
              duration_minutes: durationMinutes,
              effectiveness_rating: effectivenessRating || 5,
              notes: notes || '',
              created_at: session.created_at
            }
          });
        }
      );
    }
  );
});

// Delete a practice session
router.delete('/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const sessionId = req.params.id;
  
  // Check if session exists and belongs to user
  db.get(
    'SELECT * FROM practice_sessions WHERE id = ? AND user_id = ?',
    [sessionId, userId],
    (err, session) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!session) {
        return res.status(404).json({ error: 'Session not found or unauthorized' });
      }
      
      db.run(
        'DELETE FROM practice_sessions WHERE id = ? AND user_id = ?',
        [sessionId, userId],
        (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          // Update progress metrics
          updateProgressMetrics(userId, session.created_at.split('T')[0]);
          
          res.json({
            message: 'Practice session deleted successfully'
          });
        }
      );
    }
  );
});

// Helper function to update progress metrics
function updateProgressMetrics(userId, date) {
  // Get practice minutes for the day
  db.get(
    `SELECT SUM(duration_minutes) as total_minutes
     FROM practice_sessions
     WHERE user_id = ? AND date(created_at) = date(?)`,
    [userId, date],
    (err, result) => {
      if (err) {
        console.error('Error calculating practice minutes:', err.message);
        return;
      }
      
      const practiceMinutes = result ? result.total_minutes || 0 : 0;
      
      // Get lucid dream count for the day
      db.get(
        `SELECT COUNT(*) as lucid_count
         FROM dream_journals
         WHERE user_id = ? AND date(dream_date) = date(?) AND lucidity_level >= 5`,
        [userId, date],
        (err, result) => {
          if (err) {
            console.error('Error calculating lucid dreams:', err.message);
            return;
          }
          
          const lucidDreams = result ? result.lucid_count || 0 : 0;
          
          // Calculate consistency score (simple algorithm)
          const consistencyScore = Math.min(practiceMinutes / 30, 1); // 30+ minutes = 100% consistency
          
          // Check if metrics exist for this date
          db.get(
            `SELECT * FROM progress_metrics
             WHERE user_id = ? AND date = date(?)`,
            [userId, date],
            (err, metrics) => {
              if (err) {
                console.error('Error checking progress metrics:', err.message);
                return;
              }
              
              if (metrics) {
                // Update existing metrics
                db.run(
                  `UPDATE progress_metrics
                   SET lucid_dreams = ?, practice_minutes = ?, consistency_score = ?
                   WHERE user_id = ? AND date = date(?)`,
                  [lucidDreams, practiceMinutes, consistencyScore, userId, date],
                  (err) => {
                    if (err) {
                      console.error('Error updating progress metrics:', err.message);
                    }
                  }
                );
              } else {
                // Create new metrics
                db.run(
                  `INSERT INTO progress_metrics
                   (user_id, date, lucid_dreams, practice_minutes, consistency_score)
                   VALUES (?, date(?), ?, ?, ?)`,
                  [userId, date, lucidDreams, practiceMinutes, consistencyScore],
                  (err) => {
                    if (err) {
                      console.error('Error creating progress metrics:', err.message);
                    }
                  }
                );
              }
            }
          );
        }
      );
    }
  );
}

module.exports = router;
