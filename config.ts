import dotenv from 'dotenv';
dotenv.config();

export const env = {
    JWT_SECRET: process.env.JWT_SECRET,
    NBA_DATA_TEAMS_URL: process.env.NBA_DATA_TEAMS_URL,
    NBA_DATA_PLAYERS_URL: process.env.NBA_DATA_PLAYERS_URL,
    MONGODB_URI: process.env.MONGODB_URI,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_EMAIL: process.env.SENDGRID_EMAIL
}