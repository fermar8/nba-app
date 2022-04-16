import { ObjectId } from "mongoose";

export interface NbaPlayerType {
    team: ObjectId;
    displayName: string;
    code: string;
    country?: string;
    countryEn?: string;
    displayAffiliation?: string;
    displayNameEn?: string;
    dob?: string;
    draftYear?: string;
    experience?: string;
    firstInitial?: string;
    firstName?: string;
    firstNameEn?: string;
    height?: string;
    jerseyNo?: string;
    lastName?: string;
    lastNameEn?: string;
    leagueId?: string;
    position?: string;
    schoolType?: string;
    weight?: string;
}