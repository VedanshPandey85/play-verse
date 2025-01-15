const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "success"],
    default: "pending",
  },
});

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  slot: { type: String, required: true },
  participantsLimit: { type: Number, required: true },
  participants: [participantSchema], // Participants are stored as subdocuments
  price: { type: Number, required: true }, // Added price field
});

// Export the model
module.exports = mongoose.model("Event", eventSchema);
