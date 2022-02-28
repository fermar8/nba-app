import { Response } from 'express';
import sgMail from '@sendgrid/mail';
import { messageRepository } from './Repositories';
import ResponsesService from '../ResponsesService';

class SendGridService {
    MessageRepository: typeof messageRepository;
    constructor(MessageRepository: typeof messageRepository) {
        this.MessageRepository = MessageRepository;
    }

    sendForgotPasswordEmail = async (userEmail: string, apiKey: string, senderEmail: string, res: Response) => {
        sgMail.setApiKey(apiKey);
        const msg = await this.MessageRepository.buildMessage(userEmail, senderEmail);
        await sgMail.send(msg);
        await ResponsesService.sendOkPost('Email sent successfully', res);
    }
}

const sendGridService = new SendGridService(messageRepository);

export default sendGridService;