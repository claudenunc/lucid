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

// Get progress metrics for a user
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { timeRange } = req.query;
  
  let dateFilter = '';
  let params = [userId];
  
  // Apply date filtering based on timeRange
  if (timeRange === 'week') {
    dateFilter = 'AND date >= date("now", "-7 days")';
  } else if (timeRange === 'month') {
    dateFilter = 'AND date >= date("now", "-30 days")';
  } else if (timeRange === 'year') {
    dateFilter = 'AND date >= date("now", "-365 days")';
  }
  
  db.all(
    `SELECT * FROM progress_metrics
     WHERE user_id = ? ${dateFilter}
     ORDER BY date ASC`,
    params,
    (err, metrics) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ metrics });
    }
  );
});

// Get summary statistics
router.get('/summary', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { timeRange } = req.query;
  
  let dateFilter = '';
  let params = [userId];
  
  // Apply date filtering based on timeRange
  if (timeRange === 'week') {
    dateFilter = 'AND date >= date("now", "-7 days")';
  } else if (timeRange === 'month') {
    dateFilter = 'AND date >= date("now", "-30 days")';
  } else if (timeRange === 'year') {
    dateFilter = 'AND date >= date("now", "-365 days")';
  }
  
  db.get(
    `SELECT 
       SUM(lucid_dreams) as total_lucid_dreams,
       SUM(practice_minutes) as total_practice_minutes,
       AVG(consistency_score) as average_consistency
     FROM progress_metrics
     WHERE user_id = ? ${dateFilter}`,
    params,
    (err, summary) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({
        summary: {
          totalLucidDreams: summary ? summary.total_lucid_dreams || 0 : 0,
          totalPracticeMinutes: summary ? summary.total_practice_minutes || 0 : 0,
          averageConsistency: summary ? summary.average_consistency || 0 : 0
        }
      });
    }
  );
});

// Get streak information
router.get('/streak', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  db.all(
    `SELECT date FROM progress_metrics
     WHERE user_id = ? AND (practice_minutes > 0 OR lucid_dreams > 0)
     ORDER BY date DESC`,
    [userId],
    (err, dates) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Calculate current streak
      let currentStreak = 0;
      let longestStreak = 0;
      
      if (dates.length > 0) {
        // Check if most recent date is today or yesterday
        const mostRecentDate = new Date(dates[0].date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (mostRecentDate.getTime() === today.getTime() || 
            mostRecentDate.getTime() === yesterday.getTime()) {
          
          currentStreak = 1;
          
          // Check consecutive days
          for (let i = 1; i < dates.length; i++) {
            const currentDate = new Date(dates[i-1].date);
            const prevDate = new Date(dates[i].date);
            
            // Check if dates are consecutive
            const diffTime = Math.abs(currentDate - prevDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              currentStreak++;
            } else {
              break;
            }
          }
        }
        
        // Calculate longest streak
        let tempStreak = 1;
        for (let i = 1; i < dates.length; i++) {
          const currentDate = new Date(dates[i-1].date);
          const prevDate = new Date(dates[i].date);
          
          // Check if dates are consecutive
          const diffTime = Math.abs(currentDate - prevDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
        
        longestStreak = Math.max(longestStreak, tempStreak);
      }
      
      res.json({
        streak: {
          current: currentStreak,
          longest: longestStreak
        }
      });
    }
  );
});

module.exports = router;
