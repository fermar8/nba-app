import { Response } from 'express';

class ResponsesService {
    sendOkPost = async (message: string, res: Response) => {
        res.status(200).json({
            status: 'ok',
            message: message
        })
    }

    sendOkNoContent = async (message: string, res: Response) => {
        res.status(204).json({
            status: 'ok',
            message: message
        })
    }

    sendBadRequestResponse = async (message: string, error: unknown, res: Response) => {
        res.status(400).json({
            status: 'error',
            message: message,
            error: error,
        })
    }

    sendUnexpectedErrorResponse = async (message: string, error: unknown, res: Response) => {
        res.status(404).json({
            status: 'error',
            message: message,
            error: error,
        })
    }

    buildAndSendCookie = async (token: string, res: Response) => {
        res.cookie('token', token, {
            sameSite: 'strict',
            path: '/',
            expires: new Date(new Date().setDate(new Date().getDate() + 7)),
            httpOnly: true
        })
    }
}

const responsesService = new ResponsesService();

export default responsesService;