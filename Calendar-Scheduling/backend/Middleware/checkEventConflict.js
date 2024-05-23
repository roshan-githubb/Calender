const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const databasePath = path.resolve(__dirname, '../db/eventsDatabase.db');

// Middleware to check for event conflicts
function checkEventConflict(req, res, next, io) {
    const { startTime, endTime, participants} = req.body;

    const eventId = req.body.id || 0;

    const db = new sqlite3.Database(databasePath);

    db.all(
        'SELECT id, title, participants, startTime, endTime FROM eventsList',
        (err, rows) => {
            if (err) {
                db.close();
                return res.status(500).json({ error: 'Database error' });
            }

            // Filter events where at least one participant is present
            const eventsWithParticipants = rows.filter(event => {
                const eventParticipants = event.participants;
                if (eventParticipants !== null) {
                    return participants.some(participant => eventParticipants.includes(participant));
                }
            });

            // Check for conflicts only in events with participants
            const conflictingEvent = eventsWithParticipants.find(event => {
                return (
                    eventId !== event.id && (startTime >= event.startTime && startTime <= event.endTime) ||
                    (endTime >= event.startTime && endTime <= event.endTime) 
                );
            });

            if (conflictingEvent) {
                db.close();
                io.emit('event-conflict', 'Meeting already scheduled at this time')
                return res.status(409).json({ error: 'Event conflict', conflictingEvent: conflictingEvent.title });
            }

            db.close();
            next();
        }
    );
}

module.exports = { checkEventConflict };
