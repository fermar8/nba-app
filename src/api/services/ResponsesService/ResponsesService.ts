import { Response } from 'express';

class ResponsesService {
    sendOkPost = async (message: string, res: Response, payload?: any) => {
        res.status(200).json({
            status: 'ok',
            message,
            payload
        })
    }

    sendOkContent = async (message: any, res: Response) => {
        res.status(201).json({
            status: 'ok',
            message
        })
    }

    sendOkNoContent = async (message: string, res: Response) => {
        res.status(204).json({
            status: 'ok',
            message
        })
    }

    sendBadRequestResponse = async (message: string, res: Response) => {
        res.status(400).json({
            status: 'bad request',
            message
        })
    }

    sendUnexpectedErrorResponse = async (message: string, error: unknown, res: Response) => {
        res.status(404).json({
            status: 'error',
            message,
            error: error ? error : 'unexpected error',
        })
    }

    buildCookies = async (signedTokens: { [key: string]: string; }, res: Response) => {
        res.cookie('dbToken', signedTokens.dbToken, {
            sameSite: 'strict',
            path: '/',
            expires: new Date(new Date().setDate(new Date().getDate() + 7)),
            httpOnly: true
        })
        res.cookie('frontToken', signedTokens.frontToken, {
            sameSite: 'strict',
            path: '/',
            expires: new Date(new Date().setDate(new Date().getDate() + 7)),
        })

    }
}

const responsesService = new ResponsesService();

export default responsesService;