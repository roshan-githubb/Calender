const express = require('express');
const { createEvent } = require('../Controller/createEvent');
const { checkEventConflict } = require('../Middleware/checkEventConflict');
const { deleteEvent, editEvent } = require('../Controller/modifyEvent');

function setupRoutes(app, io) {
    const eventRouter = express.Router();

    eventRouter.post('/create-new-event', (req, res, next) => {
        checkEventConflict(req, res, next, io);
    }, (req, res) => {
        createEvent(req, res, io);
    });

    eventRouter.delete('/delete-event', (req, res) => {
        deleteEvent(req, res, io);
    });

    eventRouter.put('/edit-event', (req, res, next) => {
        checkEventConflict(req, res, next, io);
    }, (req, res) => {
        editEvent(req, res, io);
    });
    app.use('/events', eventRouter);
}

module.exports = { setupRoutes };
