import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Please enter fullname"],
    },
    username: {
        type: String,
        required: [true, "Please enter an unique username"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
    },
    updatedOn: {
        type: Date,
        default: Date.now(),
    }
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;