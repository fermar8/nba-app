import { UserBasic, UserData } from '../../../api/types/auth';
import { Request, Response } from 'express';

import ResponsesService from '../ResponsesService/';
import { tokenRepository, userRepository, leaguesRepository } from '../../repositories';


class AuthService {
   UserRepository: typeof userRepository;
   TokenRepository: typeof tokenRepository;
   LeaguesRepository: typeof leaguesRepository;
   constructor(
      UserRepository: typeof userRepository, 
      TokenRepository: typeof tokenRepository, 
      LeaguesRepository: typeof leaguesRepository
      ) {
      this.UserRepository = UserRepository,
      this.TokenRepository = TokenRepository,
      this.LeaguesRepository = LeaguesRepository
   }

   getCookieByName = async (headersToken: any, name: string) =>{
      const arrOfCookies = headersToken.split(' ');
      let cookie = ''
  
      arrOfCookies.forEach((element: string) => {
          if(element.includes(name)){
              cookie = element.replace(name+'=','').slice(0, -1);
          }
      });
      return cookie
  }

   createPassword = async (password: string) => {
      return await this.UserRepository.createPassword(password);
   }

   createUser = async (userData: UserBasic, password: string, signedTokens: { [key: string]: string; }) => {
      return await this.UserRepository.createUser(userData, password, signedTokens);
   }

   deleteUser = async (token: string) => {
      const user = await this.UserRepository.findUserByToken(token);
      for (const teamId of user.teams) {
         await this.LeaguesRepository.deleteTeam(teamId); 
      }
      return await this.UserRepository.deleteUser(user);
   }

   getUserData = async (req: Request) => {
      return await this.UserRepository.getUserData(req.body.name, req.body.email, req.body.password);
   }

   findUserByEmail = async (email: string) => {
      return await this.UserRepository.findUserByEmail(email);
   }

   findUserByToken = async (token: string) => {
      return await this.UserRepository.findUserByToken(token);
   }

   resetPassword = async (email: string, password: string) => {
      const newPassword: string = await this.UserRepository.createPassword(password);
      await this.UserRepository.updatePassword(email, newPassword);
   };

   validatePassword = async (receivedPassword: string, userPassword: string) => {
      return await this.UserRepository.validatePassword(receivedPassword, userPassword);
   }

   signTokens = async (userData: UserData, secret: string) => {
      return await this.TokenRepository.signTokens(userData, secret);
   }

   sendCookiesAndUser = async (signedTokens: { [key: string]: string; }, res: Response) => {
      await ResponsesService.buildCookies(signedTokens, res);
      const userData = await this.UserRepository.findUserByToken(signedTokens.dbToken);
      await ResponsesService.sendOkPost('Cookies initialized', res, userData);
   }


   refreshCookies = async (refreshTokens: { [key: string]: string; }, res: Response, userData: UserData) => {
      await ResponsesService.buildCookies(refreshTokens, res);
      await ResponsesService.sendOkPost('Cookie refreshed', res, userData)
   }

   updateTokenByEmail = async (email: string, signedTokens: { [key: string]: string; }, res: Response) => {
      await this.TokenRepository.updateTokenByEmail(email, signedTokens);
      await this.sendCookiesAndUser(signedTokens, res);
   }

   updateTokenByToken = async (token: string, refreshTokens: { [key: string]: string; }, res: Response) => {
      await this.TokenRepository.updateTokenByToken(token, refreshTokens);
      await this.sendCookiesAndUser(refreshTokens, res);
   }

   verifyToken = async (token: string, secret: string) => {
      return await this.TokenRepository.verifyToken(token, secret);
   }

   sliceToken = async (req: Request) => {
      return await this.TokenRepository.sliceToken(req.headers.cookie!);
   }

   deleteTokenFromDb = async (token: string) => {
      return await this.TokenRepository.deleteTokenFromDb(token);
   }

}

const authService = new AuthService(userRepository, tokenRepository, leaguesRepository);

export default authService;