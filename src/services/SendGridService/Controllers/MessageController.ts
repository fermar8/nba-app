class MessageController {

    buildMessage = async (userEmail: string, senderEmail: string) => {
        const msg = {
            to: userEmail,
            from: senderEmail,
            subject: 'Reset password',
            text: 'Use the following link to reset your password',
            html: '<a>http://localhost:3000/register</a>',
        }
        return msg;
    }
}


const messageController = new MessageController();

export default messageController;