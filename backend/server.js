// Update server.js to include all routes
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database
const db = new sqlite3.Database('./lucid.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database');
    // Initialize database tables
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Read SQL schema files and execute them
  const schemaDir = path.join(__dirname, 'schema');
  
  // Create schema directory if it doesn't exist
  if (!fs.existsSync(schemaDir)) {
    fs.mkdirSync(schemaDir);
  }
  
  // Copy schema files from frontend to backend if they don't exist
  const frontendSchemaDir = path.join(__dirname, '..', 'src', 'database');
  if (fs.existsSync(frontendSchemaDir)) {
    const schemaFiles = fs.readdirSync(frontendSchemaDir);
    
    schemaFiles.forEach(file => {
      const sourcePath = path.join(frontendSchemaDir, file);
      const destPath = path.join(schemaDir, file);
      
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied schema file: ${file}`);
      }
    });
  }
  
  // Execute schema files in order
  if (fs.existsSync(schemaDir)) {
    const schemaFiles = fs.readdirSync(schemaDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure correct order
    
    schemaFiles.forEach(file => {
      const filePath = path.join(schemaDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      db.exec(sql, err => {
        if (err) {
          console.error(`Error executing schema file ${file}:`, err.message);
        } else {
          console.log(`Executed schema file: ${file}`);
        }
      });
    });
  }
}

// Import routes
const authRoutes = require('./routes/auth');
const dreamJournalRoutes = require('./routes/dreamJournal');
const practiceSessionRoutes = require('./routes/practiceSession');
const progressTrackingRoutes = require('./routes/progressTracking');
const audioResourceRoutes = require('./routes/audioResource');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/dream-journal', dreamJournalRoutes);
app.use('/api/practice-session', practiceSessionRoutes);
app.use('/api/progress-tracking', progressTrackingRoutes);
app.use('/api/audio-resource', audioResourceRoutes);

// Create public directories if they don't exist
const publicDir = path.join(__dirname, 'public');
const audioDir = path.join(publicDir, 'audio');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir);
}

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Lucid Dreams API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
