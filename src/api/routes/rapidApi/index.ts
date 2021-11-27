import { env } from '../../../../config';
import axios, { Method } from 'axios';
import { Router, Request, Response } from 'express';
import { ResponsesService } from '../../services';

export const rapidApi = Router();

rapidApi.get('/player', async (req: Request, res: Response) => {
    const playerId = req.body.playerId;

    try {
        const options = {
            method: 'GET' as Method,
            url: `https://api-nba-v1.p.rapidapi.com/players/playerId/${playerId}`,
            headers: {
              'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
              'x-rapidapi-key': env.RAPID_API_NBA_KEY as string
            }
          };
        const response = await axios.request(options);

        await ResponsesService.sendOkContent(response.data.api.players[0], res);
    } catch (err: any) {
        await ResponsesService.sendUnexpectedErrorResponse('Could not find player', err.message, res);
    }
	
});

rapidApi.get('/player/name', async (req: Request, res: Response) => {
    const playerName = req.body.playerName;
 
     try {
         const options = {
             method: 'GET' as Method,
             url: `https://api-nba-v1.p.rapidapi.com/players/firstName/${playerName}`,
             headers: {
               'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
               'x-rapidapi-key': env.RAPID_API_NBA_KEY as string
             },
             seasons: '2021'
           };
         const response = await axios.request(options);
         await ResponsesService.sendOkContent(response.data.api.players[0], res);
     } catch (err: any) {
         await ResponsesService.sendUnexpectedErrorResponse('Could not find player', err.message, res);
     }	
 });

rapidApi.get('/player/statistics', async (req: Request, res: Response) => {
   const playerId = req.body.playerId;

    try {
        const options = {
            method: 'GET' as Method,
            url: `https://api-nba-v1.p.rapidapi.com/statistics/players/playerId/${playerId}`,
            headers: {
              'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
              'x-rapidapi-key': env.RAPID_API_NBA_KEY as string
            },
            seasons: '2021'
          };
        const response = await axios.request(options);
        await ResponsesService.sendOkContent(response.data.api.statistics[0], res);
    } catch (err: any) {
        await ResponsesService.sendUnexpectedErrorResponse('Could not find player', err.message, res);
    }	
});