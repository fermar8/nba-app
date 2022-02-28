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