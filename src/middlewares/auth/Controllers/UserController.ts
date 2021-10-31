import bcrypt from 'bcrypt';
import User from '../../../models/user';
import { UserData } from '../../../api/routes/auth/types';


class UserController {

    createPassword = async (password: string) => {
        return bcrypt.hash(password, 10);
    }

    createUser = async (userData: UserData, password: string, token: string) => {
        await User.create({
            name: userData.name,
            email: userData.email,
            password: password,
            token: token,
            createdAt: Date.now()
        })
    }

    getUserData = async (name: string, email: string, password: string) => {
        const userData: UserData = {
            name: name,
            email: email,
            password: password
        }
        return userData;
    }

    findUserByEmail = async (email: string) => {
        const userData: UserData = await User.findOne({
            email: email,
        })
        return userData;
    }

    findUserByToken = async (token: string) => {
        const userData: UserData = await User.findOne({
            token: token,
        })
        return userData;
    }

    validatePassword = async (receivedPassword: string, userPassword: string) => {
        const isPasswordValid = await bcrypt.compare(
            receivedPassword,
            userPassword
        )
        return isPasswordValid;
    }

}

const userController = new UserController();

export default userController;