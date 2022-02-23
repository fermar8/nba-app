import { UserData } from '../../../api/routes/auth/types';
import { Request, Response } from 'express';

import ResponsesService from '../ResponsesService/';
import { tokenController, userController } from './Controllers';


class AuthService {
   UserController: typeof userController;
   TokenController: typeof tokenController;
   constructor(UserController: typeof userController, TokenController: typeof tokenController) {
      this.UserController = UserController,
      this.TokenController = TokenController
   }

   createPassword = async (password: string) => {
      return this.UserController.createPassword(password);
   }

   createUser = async (userData: UserData, password: string, token: string) => {
      return this.UserController.createUser(userData, password, token);
   }

   getUserData = async (req: Request) => {
      return this.UserController.getUserData(req.body.name, req.body.email, req.body.password);
   }

   findUserByEmail = async (req: Request) => {
      return this.UserController.findUserByEmail(req.body.email);
   }

   findUserByToken = async (token: string) => {
      return this.UserController.findUserByToken(token);
   }

   resetPassword = async (email: string, password: string) => {
      const newPassword: string = await this.UserController.createPassword(password);
      await this.UserController.updatePassword(email, newPassword);
   };

   validatePassword = async (receivedPassword: string, userPassword: string) => {
      return this.UserController.validatePassword(receivedPassword, userPassword);
   }

   signToken = async (userData: UserData, secret: string) => {
      return this.TokenController.signToken(userData, secret);
   }

   sendCookieAndUser = async (token: string, res: Response) => {
      await ResponsesService.buildAndSendCookie(token, res);
      const userData = await this.UserController.findUserByToken(token);
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
      this.TokenController.updateTokenByEmail(email, token);
      this.sendCookieAndUser(token, res);
   }

   updateTokenByToken = async (token: string, refreshToken: string, res: Response) => {
      this.TokenController.updateTokenByToken(token, refreshToken);
      this.refreshCookie(refreshToken, res);
   }

   verifyToken = async (token: string, secret: string) => {
      return this.TokenController.verifyToken(token, secret);
   }

   sliceToken = async (req: Request) => {
      return this.TokenController.sliceToken(req.headers.cookie!);
   }

   deleteTokenFromDb = async (token: string) => {
      return this.TokenController.deleteTokenFromDb(token);
   }

}

const authService = new AuthService(userController, tokenController);

export default authService;