import { userModel } from "../models/user.js";

const admin = {
    first_name: 'Admin',
    last_name: 'Coder',
    email: 'adminCoder@coder.com',
    password: 'adminCod3r123',
    rol: 'admin'
}

class UserManager {
    constructor() {
    }

    getAll = async () => {
        const users = await userModel.find()
        return users.map(user => user.toObject());
    }

    saveUser = async (user) => {

        try {
            const result = await userModel.create(user);
            return result
        } catch (error) {
            throw error
        }
    }

    getUser = async (email) => {
        try {
            if (email === admin.email) {
                return admin
            }
            const result = await userModel.findOne({ email });
            return result
        } catch (error) {
            throw error
        }
    }

    login = async (email, password) => {
        try {
            if (email === admin.email && password === admin.password) {
                return admin
            }
            const result = await userModel.findOne({ email, password });
            return result
        } catch (error) {
            throw error
        }
    }
}

export default UserManager;