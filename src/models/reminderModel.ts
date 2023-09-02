import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  reminderText: { type: String },
  reminderDate: { type: String },
  relatedTaskId: { type: String },
  isDone: { type: Boolean },
  createdAt: { type: Date },
  createdBy: { type: String },
  completedAt: { type: Date },
});

const Reminder =
  mongoose.models.reminders || mongoose.model("reminders", reminderSchema);

export default Reminder;
