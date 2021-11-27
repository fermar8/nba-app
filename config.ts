import dotenv from 'dotenv';
dotenv.config();

export const env = {
    JWT_SECRET: process.env.JWT_SECRET,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_EMAIL: process.env.SENDGRID_EMAIL,
    RAPID_API_NBA_KEY: process.env.RAPID_API_NBA_KEY,
    MONGODB_URI: process.env.MONGODB_URI
}