const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const databasePath = path.resolve(__dirname, './eventsDatabase.db');

const db = new sqlite3.Database(databasePath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS eventsList (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        title TEXT,
        startTime INTEGER,
        endTime INTEGER,
        description TEXT,
        participants JSON
    )`);
});

db.close();
