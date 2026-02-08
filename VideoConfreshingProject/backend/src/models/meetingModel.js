import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema({
  user_id: {
    type: String,
  },
  mettingCode: {
    type: String,
    required: true,
  },
  date: {
    type: date,
    default: Date.now,
    required: true,
  },
});

const meetingCode = mongoose.model("meeting", meetingSchema);
export { meeting };
