import { Response } from 'express';
import sgMail from '@sendgrid/mail';
import { messageController } from './Controllers';
import ResponsesService from '../ResponsesService';

class SendGridService {
    MessageController: typeof messageController;
    constructor(MessageController: typeof messageController) {
        this.MessageController = MessageController;
    }

    sendForgotPasswordEmail = async (userEmail: string, apiKey: string, senderEmail: string, res: Response) => {
        sgMail.setApiKey(apiKey);
        const msg = await this.MessageController.buildMessage(userEmail, senderEmail);
        await sgMail.send(msg);
        await ResponsesService.sendOkPost('Email sent successfully', res);
    }
}

const sendGridService = new SendGridService(messageController);

export default sendGridService;