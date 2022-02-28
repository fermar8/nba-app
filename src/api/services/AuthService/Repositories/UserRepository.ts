import bcrypt from 'bcrypt';
import User from '../../../../models/nba-app/user';
import { UserData } from '../../../routes/auth/types';


class UserRepository {

    createPassword = async (password: string) => {
        return bcrypt.hash(password, 10);
    }

    createUser = async (userData: UserData, password: string, token: string) => {
        await User.create({
            name: userData.name,
            email: userData.email,
            password,
            token,
            createdAt: Date.now()
        })
    }

    getUserData = async (name: string, email: string, password: string) => {
        const userData: UserData = { name, email, password };
        return userData;
    }

    findUserByEmail = async (email: string) => {
        const userData: UserData = await User.findOne({ email });
        return userData;
    }

    findUserByToken = async (token: string) => {
        const userData: UserData = await User.findOne({ token })
        return userData;
    }

    updatePassword = async (email: string, newPassword: string) => {
        const response = await User.findOneAndUpdate({ email }, { password: newPassword });
        if (!response) {
            throw new Error('Email not matching with DB');
        }
    }

    validatePassword = async (receivedPassword: string, userPassword: string) => {
        const isPasswordValid = await bcrypt.compare(
            receivedPassword,
            userPassword
        )
        return isPasswordValid;
    }

}

const userRepository = new UserRepository();

export default userRepository;