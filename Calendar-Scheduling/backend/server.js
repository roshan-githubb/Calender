const express = require('express');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { HolidayAPI } = require('holidayapi');

const { setupRoutes } = require('./Routes');
const { getRecordsByMonth } = require('./Sockets/getRecordsByMonth');

require('dotenv').config();

const key = process.env.HOLIDAY_API_KEY;

const holidayApi = new HolidayAPI({ key });

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend/build')));

let holidayData = null; 

async function fetchHolidayData() {
    try {
        const response = await holidayApi.holidays({ country: 'US', year: 2023 }); 
        holidayData = response.holidays; 

    } catch (error) {
        console.error('Failed to fetch holiday data:', error);
    }
}

function emitHolidayData(socket) {
    if (holidayData) {
        socket.emit('holiday-data', holidayData);
    } else {
        console.warn('Holiday data is not available.'); 
    }
}

const activeUsers = []; 

io.on('connection', (socket) => {

    socket.broadcast.emit('new-user-connected', `USER ${socket.id} JOINED THE CONNECTION.`);

    activeUsers.push(socket.id);

    console.log(`user with ${socket.id} connected. Active users:${activeUsers.length}`);

    socket.emit('current-active-users', `${activeUsers.length} USERS IN THE NETWORK`);

    socket.emit('set-active-users', activeUsers)

    getRecordsByMonth(io)

    emitHolidayData(socket)

    socket.on('disconnect', () => {
        console.log(`user with ${socket.id} disconnected`);
        const index = activeUsers.indexOf(socket.id);
        if (index !== -1) {
            activeUsers.splice(index, 1);
        }
    });

});

setupRoutes(app, io);

server.listen(8080, async () => {
    console.log('server running at http://localhost:8080');
    await fetchHolidayData(); 

});
