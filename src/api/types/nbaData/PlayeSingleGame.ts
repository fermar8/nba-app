import { ObjectId } from 'mongoose';

export interface PlayerSingleGameNewType {
    seasonId: string;
    displayName: string;
    teamId: number;
    teamAbbreviation: string;
    teamName: string;
    gameId: string;
    gameDate: string;
    matchup: string;
    wl: string;
    min: number;
    fgm: number;
    fga: number;
    fgPct: number;
    fg3m: number;
    fg3a: number;
    fg3Pct: number;
    ftm: number;
    fta: number;
    ftPct: number;
    oreb: number;
    dreb: number;
    reb: number;
    ast: number;
    tov: number;
    stl: number;
    blk: number;
    pf: number;
    pts: number;
    plusMinus: number;
    nbaFantasyPts: number;
    videoAvailable: number;
}

export interface PlayerSingleGameDbType extends PlayerSingleGameNewType {
	_id: ObjectId;
}