const express = require("express");
const {
  getAllEvents,
  getEventById,
  createEvent,
  initiateBooking,
  confirmPayment,
} = require("../controllers/eventController");
// const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/add-event", createEvent);
router.post("/:id/book", initiateBooking);
router.post("/:id/confirm", confirmPayment);

module.exports = router;
