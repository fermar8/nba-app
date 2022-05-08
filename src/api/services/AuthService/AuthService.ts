import { UserData } from '../../../api/types/auth';
import { Request, Response } from 'express';

import ResponsesService from '../ResponsesService/';
import { tokenRepository, userRepository } from '../../repositories';


class AuthService {
   UserRepository: typeof userRepository;
   TokenRepository: typeof tokenRepository;
   constructor(UserRepository: typeof userRepository, TokenRepository: typeof tokenRepository) {
      this.UserRepository = UserRepository,
      this.TokenRepository = TokenRepository
   }

   createPassword = async (password: string) => {
      return this.UserRepository.createPassword(password);
   }

   createUser = async (userData: UserData, password: string, token: string) => {
      return this.UserRepository.createUser(userData, password, token);
   }

   getUserData = async (req: Request) => {
      return this.UserRepository.getUserData(req.body.name, req.body.email, req.body.password);
   }

   findUserByEmail = async (req: Request) => {
      return this.UserRepository.findUserByEmail(req.body.email);
   }

   findUserByToken = async (token: string) => {
      return this.UserRepository.findUserByToken(token);
   }

   resetPassword = async (email: string, password: string) => {
      const newPassword: string = await this.UserRepository.createPassword(password);
      await this.UserRepository.updatePassword(email, newPassword);
   };

   validatePassword = async (receivedPassword: string, userPassword: string) => {
      return this.UserRepository.validatePassword(receivedPassword, userPassword);
   }

   signToken = async (userData: UserData, secret: string) => {
      return this.TokenRepository.signToken(userData, secret);
   }

   sendCookieAndUser = async (token: string, res: Response) => {
      await ResponsesService.buildAndSendCookie(token, res);
      const userData = await this.UserRepository.findUserByToken(token);
      const reducedUserData = {
         username: userData.name,
         email: userData.email
      }
      await ResponsesService.sendOkPost('Cookie initialized', res, reducedUserData);
   }
   

   refreshCookie = async (token: string, res: Response) => {
      await ResponsesService.buildAndSendCookie(token, res);
      await ResponsesService.sendOkPost('Cookie refreshed', res)
   }

   updateTokenByEmail = async (email: string, token: string, res: Response) => {
      this.TokenRepository.updateTokenByEmail(email, token);
      this.sendCookieAndUser(token, res);
   }

   updateTokenByToken = async (token: string, refreshToken: string, res: Response) => {
      this.TokenRepository.updateTokenByToken(token, refreshToken);
      this.refreshCookie(refreshToken, res);
   }

   verifyToken = async (token: string, secret: string) => {
      return this.TokenRepository.verifyToken(token, secret);
   }

   sliceToken = async (req: Request) => {
      return this.TokenRepository.sliceToken(req.headers.cookie!);
   }

   deleteTokenFromDb = async (token: string) => {
      return this.TokenRepository.deleteTokenFromDb(token);
   }

}

const authService = new AuthService(userRepository, tokenRepository);

export default authService;