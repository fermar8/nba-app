import bcrypt from 'bcrypt';
import User from '../../models/nba-app/user';
import { UserBasic, UserComplete, UserToFront } from '../types/auth';


class UserRepository {

    createPassword = async (password: string) => {
        return bcrypt.hash(password, 10);
    }

    createUser = async (userData: UserBasic, password: string, signedTokens: { [key: string]: string; }) => {
        await User.create({
            name: userData.name,
            email: userData.email,
            teams: [],
            password,
            token: signedTokens.dbToken,
            createdAt: Date.now()
        })
    }

    deleteUser = async (user: any) => {
        await User.findByIdAndDelete(user._id);
    }

    getUserData = async (name: string, email: string, password: string) => {
        const userData: UserBasic = { name, email, password };
        return userData;
    }

    findUserByEmail = async (email: string) => {
        const userData: UserComplete | null = await User.findOne({ email });
        if (userData) {
            return userData;
        } else {
            throw new Error('Could not find user in DB');
        }
    }

    findUserByToken = async (token: string) => {
        const userData: UserToFront | null = await User.findOne({ token });
        if (userData) {
            const reducedUserData = {
                teams: userData.teams || [],
                leagues: userData.leagues || [],
                name: userData.name,
                email: userData.email,
                _id: userData._id,
                createdAt: userData.createdAt
            }
            return reducedUserData;
        } else {
            throw new Error('Could not find user in DB');
        }
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