const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const moment = require('moment-timezone');

const databasePath = path.resolve(__dirname, '../db/eventsDatabase.db');

function getRecordsByMonth(io) {
    const db = new sqlite3.Database(databasePath);

    db.all(
        'SELECT * FROM eventsList ORDER BY startTime',
        [],
        function(err, rows) {
            if (err) {
                console.error('Failed to fetch records by month:', err);
                // Emit an error event to the client
                io.emit('fetch-events-error', { error: 'Failed to fetch records by month' });
                return;
            }

            // Group events by date
            const eventsByDateLocal = {};
            const eventsByDateUTC = {};

            rows.forEach(row => {
                const startTime = moment(row.startTime);
                const endTime = moment(row.endTime);

                const eventDate = new Date(row.startTime);
                const year = eventDate.getFullYear();
                const month = eventDate.getMonth() + 1; // Months are zero-based, so add 1
                const day = eventDate.getDate();

                const localDateKey = `${year}-${month}-${day}`;
                const utcDateKey = moment.utc(row.startTime).format('YYYY-M-D');

                if (!eventsByDateLocal[localDateKey]) {
                    eventsByDateLocal[localDateKey] = [];
                }
                eventsByDateLocal[localDateKey].push({
                    ...row,
                    startTime: startTime.format(),
                    endTime: endTime.format(),
                });

                if (!eventsByDateUTC[utcDateKey]) {
                    eventsByDateUTC[utcDateKey] = [];
                }
                eventsByDateUTC[utcDateKey].push({
                    ...row,
                    startTime: startTime.utc().format(),
                    endTime: endTime.utc().format(),
                });
            });

            io.emit('events-by-date-local', eventsByDateLocal);
            io.emit('events-by-date-utc', eventsByDateUTC);
        }
    );

    db.close();
}

module.exports = { getRecordsByMonth };
