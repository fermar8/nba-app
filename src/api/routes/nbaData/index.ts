import { Router, Request, Response } from 'express';
import { NbaDataService, ResponsesService } from '../../services';

export const nbaData = Router();

nbaData.put('/nbadataupdate', async (_req: Request, res: Response) => {
  try {
    await NbaDataService.buildAndSaveAllTeams(res);
    await NbaDataService.buildAndSaveAllPlayers(res);
    await NbaDataService.buildAndSavePlayerSeasonStats(res);
    await NbaDataService.buildAndSaveLast5GamesStats(res);
    await NbaDataService.buildAndSaveAllGamesByPlayer(res);
    await NbaDataService.saveAndBuildAllPlayerStats(res);
    await ResponsesService.sendOkContent('All nba data updated successfully in DB', res);
  } catch (err: any) {
    console.log('err', err)
    await ResponsesService.sendUnexpectedErrorResponse('Error when updating nba data ', err.message, res);
  }
});