const sqlite3 = require('sqlite3').verbose();

// Initialize database connection
const db = new sqlite3.Database('./lucid.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database');
  }
});

// Export the database connection
module.exports = db;
