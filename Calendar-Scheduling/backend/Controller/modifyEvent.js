const path = require('path');
const { getRecordsByMonth } = require('../Sockets/getRecordsByMonth');
const sqlite3 = require('sqlite3').verbose();
const databasePath = path.resolve(__dirname, '../db/eventsDatabase.db');

function deleteEvent(req, res, io) {
    const id = req.query.id;
    
    const db = new sqlite3.Database(databasePath);

    db.run(
        'DELETE FROM eventsList WHERE id = ?',
        [id],
        function(err) {
            if (err) {
                console.log('Error deleting event:', err);
                return res.status(500).json({ error: 'Failed to delete event' });
            }

            // Emit message to clients
            io.emit('event-deleted', 'Event deleted successfully');
            getRecordsByMonth(io);
            res.status(200).json({ message: 'Event deleted successfully' });
        }
    );

    db.close();
}

function editEvent(req, res, io) {

    const { id, title, startTime, endTime, description, participants } = req.body;

    const setClause = [];
    const values = [];

    if (title) {
        setClause.push('title = ?');
        values.push(title);
    }

    if (startTime) {
        setClause.push('startTime = ?');
        values.push(startTime);
    }

    if (endTime) {
        setClause.push('endTime = ?');
        values.push(endTime);
    }

    if (description) {
        setClause.push('description = ?');
        values.push(description);
    }

    if (participants) {
        setClause.push('participants = ?');
        values.push(JSON.stringify(participants));
    }

    if (setClause.length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
    }

    const query = `UPDATE eventsList SET ${setClause.join(', ')} WHERE id = ?`;

    const db = new sqlite3.Database(databasePath);

    db.run(
        query,
        [...values, id],
        function(err) {
            if (err) {
                console.log('Error updating event:', err);
                return res.status(500).json({ error: 'Failed to update event' });
            }
            io.emit('event-edited', `Event id ${id} edited`);
            getRecordsByMonth(io);

            res.status(200).json({ message: 'Event edited successfully' });
        }
    );

    db.close();
}

module.exports = { deleteEvent, editEvent };
