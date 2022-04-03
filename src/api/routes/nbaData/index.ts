import { Router, Request, Response } from 'express';
import { NbaDataService, ResponsesService } from '../../services';

export const nbaData = Router();

nbaData.put('/teams', async (_req: Request, res: Response) => {
  try {
    await NbaDataService.buildAndSaveAllTeams();
    await ResponsesService.sendOkContent('Teams updated successfully in DB', res);
  } catch (err: any) {
    console.log('err', err)
    await ResponsesService.sendUnexpectedErrorResponse('Error when updating teams', err.message, res);
  }

});

nbaData.put('/players', async (_req: Request, res: Response) => {
  try {
    await NbaDataService.buildAndSaveAllPlayers();
    await ResponsesService.sendOkContent('Players updated successfully in DB', res);
  } catch (err: any) {
    console.log('err', err)
    await ResponsesService.sendUnexpectedErrorResponse('Error when updating players', err.message, res);
  }

});

nbaData.put('/seasonstats', async (_req: Request, res: Response) => {
  try {
    await NbaDataService.buildAndSavePlayerSeasonStats();
    await ResponsesService.sendOkContent('Player season stats updated successfully in DB', res);
  } catch (err: any) {
    console.log('err', err)
    await ResponsesService.sendUnexpectedErrorResponse('Error when updating season stats', err.message, res);
  }

});


nbaData.put('/lastfive', async (_req: Request, res: Response) => {
  try {
    await NbaDataService.buildAndSaveLast5GamesStats();
    await ResponsesService.sendOkContent('Player last five games stats updated successfully in DB', res);
  } catch (err: any) {
    console.log('err', err)
    await ResponsesService.sendUnexpectedErrorResponse('Error when updating last five games stats', err.message, res);
  }

});

nbaData.put('/gamesbyplayer', async (_req: Request, res: Response) => {
  try {
    await NbaDataService.buildAndSaveAllGamesByPlayer();
    await ResponsesService.sendOkContent('Player last five games stats updated successfully in DB', res);
  } catch (err: any) {
    console.log('err', err)
    await ResponsesService.sendUnexpectedErrorResponse('Error when updating last five games stats', err.message, res);
  }

});

nbaData.put('/playerstats', async (_req: Request, res: Response) => {
  try {
    await NbaDataService.saveAndBuildAllPlayerStats();
    await ResponsesService.sendOkContent('Player stats updated successfully in DB', res);
  } catch (err: any) {
    console.log('err', err)
    await ResponsesService.sendUnexpectedErrorResponse('Error when updating player stats', err.message, res);
  }

});