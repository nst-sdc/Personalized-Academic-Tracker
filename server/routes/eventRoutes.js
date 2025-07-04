const express = require('express');
const { protect } = require('../middleware/JWTauthentication');
const {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
    .get(getEvents)
    .post(createEvent);

router.route('/:id')
    .put(updateEvent)
    .delete(deleteEvent);

module.exports = router;