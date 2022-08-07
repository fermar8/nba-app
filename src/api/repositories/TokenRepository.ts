import { UserData } from '../types/auth';
import User from '../../models/nba-app/user';
import jwt from 'jsonwebtoken';
import { env } from '../../../config';

class TokenRepository {

   signTokens = async (userData: UserData, secret: string) => {

      const frontSecret = env.JWT_FRONT_SECRET as string
      const dbToken: string = jwt.sign({
         name: userData.name,
         email: userData.email
      },
         secret, { expiresIn: '7d' }
      )
      const frontToken: string = jwt.sign({},
         frontSecret, { expiresIn: '7d' }
      )

      return { dbToken, frontToken };
   }

   sliceToken = async (cookie: string) => {
      const slicedCookie = cookie.slice(6);
      if (!slicedCookie) {
         throw new Error('No token received')
      }
      return slicedCookie
   }

   updateTokenByEmail = async (email: string, signedTokens: { [key: string]: string; }) => {
      await User.findOneAndUpdate({ email }, { token: signedTokens.dbToken });
   }

   updateTokenByToken = async (token: string, refreshTokens: { [key: string]: string; }) => {
      await User.findOneAndUpdate({ token }, { token: refreshTokens.dbToken });
   }

   verifyToken = async (token: string, secret: string) => {
      const isTokenValid = jwt.verify(token, secret);
      if (isTokenValid) {
         return true
      } else {
         return false
      }
   }

   deleteTokenFromDb = async (token: string) => {
      await User.findOneAndUpdate({ token }, { $unset: { token } })
   }



}

const tokenRepository = new TokenRepository();

export default tokenRepository;