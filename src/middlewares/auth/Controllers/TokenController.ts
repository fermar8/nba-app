import { UserData } from '../../../api/routes/auth/types';
import User from '../../../models/user';
import jwt from 'jsonwebtoken';

class TokenController {

    signToken = async (userData: UserData, secret: string) => {
        const token: string = jwt.sign({
           name: userData.name,
           email: userData.email
        },
           secret, { expiresIn: '7d' }
        )
        return token;
     }

     sliceToken = async (cookie: string) => {
      const slicedCookie = cookie.slice(6);
      if (!slicedCookie) {
         throw new Error('No token received')
      }
      return slicedCookie
   }

     updateTokenByEmail = async (email: string, token: string) => {
        await User.findOneAndUpdate({ email: email }, { token: token });
     }

     updateTokenByToken = async (token: string, refreshToken: string) => {
        await User.findOneAndUpdate({ token: token }, { token: refreshToken });
     }

     verifyToken = async (token: string, secret: string) => {
        const isTokenValid = jwt.verify(token, secret);
        return isTokenValid;
     }

     deleteTokenFromDb = async (token: string) => {
         await User.findOneAndUpdate({ token: token}, {$unset: {token}})
     }

     

}

const tokenController = new TokenController();

export default tokenController;