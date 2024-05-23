# Calendar-SCheduling

1. The Calendar-Scheduling application operates by initializing a socket.io object upon node.js express application startup to enable instant communication among connected browser clients.
2. Data management is facilitated through a SQLite3 database, accessible via three endpoints: /events/create-new-event, /events/edit-event, and /events/delete-event.
3. Real-time updates are achieved as the frontend listens for socket.io notifications, ensuring immediate reflection of data changes when events are modified.
4. Conflict checks are implemented to prevent scheduling conflicts, notifying users if a selected time slot overlaps with existing meetings.


## How to run
1. To begin using the application, navigate to the backend directory, install dependencies with npm install, set up the SQLite schema using npm run setup, create a .env file with the HOLIDAY_API_KEY value, and start the express server at port 8080 with npm start.
2. Similarly, in the frontend directory, install dependencies with npm install and start the application at port 3000 with npm start.