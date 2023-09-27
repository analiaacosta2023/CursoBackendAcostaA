import mongoose from "mongoose";

const usersCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    rol: {
        type: String,
        enum: ["usuario", "admin"],
        default: "usuario"
    },
    userName: {
        type: String,
        unique: true
    }
});

export const userModel = mongoose.model(usersCollection, userSchema)