const path = require('path');
const { getRecordsByMonth } = require('../Sockets/getRecordsByMonth');
const sqlite3 = require('sqlite3').verbose();
const databasePath = path.resolve(__dirname, '../db/eventsDatabase.db');

function createEvent(req, res, io) {
    const { userId, title, startTime, endTime, description, participants } = req.body;

    const db = new sqlite3.Database(databasePath);

    db.run(
        'INSERT INTO eventsList (userId, title, startTime, endTime, description, participants) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, title, startTime, endTime, description, JSON.stringify(participants)],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create event' });
            }
            res.status(201).json({ message: 'Event created successfully' });
            getRecordsByMonth(io);
            io.emit('new-event-created', `New event created for ${startTime}`)
        }
    );


    db.close();
}

module.exports = { createEvent };