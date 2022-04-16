import { ObjectId } from 'mongoose';

export interface PlayerLastFiveNewType {
    seasonId: string;
    playerId: number;
    displayName: string;
    firstName: string;
    teamId: number;
    teamAbbreviation: string;
    age: number;
    gp: number;
    w: number;
    l: number;
    wPct: number;
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
    blka: number;
    pf: number;
    pfd: number;
    pts: number;
    plusMinus: number;
    nbaFantasyPts: number;
    dd2: number;
    td3: number;
    gpRank: number;
    wRank: number;
    lRank: number;
    wPctRank: number;
    minRank: number;
    fgmRank: number;
    fgaRank: number;
    fgPctRank: number;
    fg3mRank: number;
    fg3aRank: number;
    fg3PctRank: number;
    ftmRank: number;
    ftaRank: number;
    ftPctRank: number;
    orebRank: number;
    drebRank: number;
    rebRank: number;
    astRank: number;
    tovRank: number;
    stlRank: number;
    blkRank: number;
    blkaRank: number;
    pfRank: number;
    pfdRank: number;
    ptsRank: number;
    plusMinusRank: number;
    nbaFantasyPtsRank: number;
    dd2Rank: number;
    td3Rank: number;
    cfid: number;
    cfparams: string;
}


export interface PlayerLastFiveDbType extends PlayerLastFiveNewType {
	_id: ObjectId;
}