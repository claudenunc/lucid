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

// Get all dream journal entries for a user
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  db.all(
    `SELECT dj.*, 
     GROUP_CONCAT(DISTINCT dt.tag_name) as tags
     FROM dream_journals dj
     LEFT JOIN dream_tags dt ON dj.id = dt.dream_id
     WHERE dj.user_id = ?
     GROUP BY dj.id
     ORDER BY dj.dream_date DESC`,
    [userId],
    (err, entries) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Process entries to convert tags string to array
      const processedEntries = entries.map(entry => {
        return {
          ...entry,
          tags: entry.tags ? entry.tags.split(',') : []
        };
      });
      
      res.json({ entries: processedEntries });
    }
  );
});

// Get a specific dream journal entry
router.get('/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const entryId = req.params.id;
  
  db.get(
    `SELECT dj.*, 
     GROUP_CONCAT(DISTINCT dt.tag_name) as tags
     FROM dream_journals dj
     LEFT JOIN dream_tags dt ON dj.id = dt.dream_id
     WHERE dj.id = ? AND dj.user_id = ?
     GROUP BY dj.id`,
    [entryId, userId],
    (err, entry) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!entry) {
        return res.status(404).json({ error: 'Entry not found' });
      }
      
      // Process entry to convert tags string to array
      const processedEntry = {
        ...entry,
        tags: entry.tags ? entry.tags.split(',') : []
      };
      
      res.json({ entry: processedEntry });
    }
  );
});

// Create a new dream journal entry
router.post('/', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { title, content, dreamDate, lucidityLevel, dreamSigns, techniquesUsed, tags } = req.body;
  
  // Validate input
  if (!title || !content || !dreamDate) {
    return res.status(400).json({ error: 'Title, content, and dream date are required' });
  }
  
  const now = new Date().toISOString();
  
  // Begin transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    db.run(
      `INSERT INTO dream_journals 
       (user_id, title, content, dream_date, lucidity_level, dream_signs, techniques_used, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, content, dreamDate, lucidityLevel || 0, 
       JSON.stringify(dreamSigns || []), JSON.stringify(techniquesUsed || []), 
       now, now],
      function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }
        
        const entryId = this.lastID;
        
        // Add tags if provided
        if (tags && tags.length > 0) {
          const tagInsertStmt = db.prepare('INSERT INTO dream_tags (dream_id, tag_name) VALUES (?, ?)');
          
          tags.forEach(tag => {
            tagInsertStmt.run(entryId, tag, (err) => {
              if (err) {
                console.error('Error inserting tag:', err.message);
              }
            });
          });
          
          tagInsertStmt.finalize();
        }
        
        db.run('COMMIT', (err) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
          
          res.status(201).json({
            message: 'Dream journal entry created successfully',
            entry: {
              id: entryId,
              user_id: userId,
              title,
              content,
              dream_date: dreamDate,
              lucidity_level: lucidityLevel || 0,
              dream_signs: dreamSigns || [],
              techniques_used: techniquesUsed || [],
              tags: tags || [],
              created_at: now,
              updated_at: now
            }
          });
        });
      }
    );
  });
});

// Update a dream journal entry
router.put('/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const entryId = req.params.id;
  const { title, content, dreamDate, lucidityLevel, dreamSigns, techniquesUsed, tags } = req.body;
  
  // Validate input
  if (!title || !content || !dreamDate) {
    return res.status(400).json({ error: 'Title, content, and dream date are required' });
  }
  
  // Check if entry exists and belongs to user
  db.get(
    'SELECT * FROM dream_journals WHERE id = ? AND user_id = ?',
    [entryId, userId],
    (err, entry) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!entry) {
        return res.status(404).json({ error: 'Entry not found or unauthorized' });
      }
      
      const now = new Date().toISOString();
      
      // Begin transaction
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        db.run(
          `UPDATE dream_journals 
           SET title = ?, content = ?, dream_date = ?, lucidity_level = ?, 
           dream_signs = ?, techniques_used = ?, updated_at = ?
           WHERE id = ? AND user_id = ?`,
          [title, content, dreamDate, lucidityLevel || 0, 
           JSON.stringify(dreamSigns || []), JSON.stringify(techniquesUsed || []), 
           now, entryId, userId],
          (err) => {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: err.message });
            }
            
            // Delete existing tags
            db.run('DELETE FROM dream_tags WHERE dream_id = ?', [entryId], (err) => {
              if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
              }
              
              // Add new tags if provided
              if (tags && tags.length > 0) {
                const tagInsertStmt = db.prepare('INSERT INTO dream_tags (dream_id, tag_name) VALUES (?, ?)');
                
                tags.forEach(tag => {
                  tagInsertStmt.run(entryId, tag, (err) => {
                    if (err) {
                      console.error('Error inserting tag:', err.message);
                    }
                  });
                });
                
                tagInsertStmt.finalize();
              }
              
              db.run('COMMIT', (err) => {
                if (err) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: err.message });
                }
                
                res.json({
                  message: 'Dream journal entry updated successfully',
                  entry: {
                    id: entryId,
                    user_id: userId,
                    title,
                    content,
                    dream_date: dreamDate,
                    lucidity_level: lucidityLevel || 0,
                    dream_signs: dreamSigns || [],
                    techniques_used: techniquesUsed || [],
                    tags: tags || [],
                    updated_at: now
                  }
                });
              });
            });
          }
        );
      });
    }
  );
});

// Delete a dream journal entry
router.delete('/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const entryId = req.params.id;
  
  // Check if entry exists and belongs to user
  db.get(
    'SELECT * FROM dream_journals WHERE id = ? AND user_id = ?',
    [entryId, userId],
    (err, entry) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!entry) {
        return res.status(404).json({ error: 'Entry not found or unauthorized' });
      }
      
      // Begin transaction
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        // Delete tags first (foreign key constraint)
        db.run('DELETE FROM dream_tags WHERE dream_id = ?', [entryId], (err) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
          
          // Delete the entry
          db.run(
            'DELETE FROM dream_journals WHERE id = ? AND user_id = ?',
            [entryId, userId],
            (err) => {
              if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
              }
              
              db.run('COMMIT', (err) => {
                if (err) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: err.message });
                }
                
                res.json({
                  message: 'Dream journal entry deleted successfully'
                });
              });
            }
          );
        });
      });
    }
  );
});

module.exports = router;
