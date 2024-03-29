import { Request, Response} from 'express';
import prisma from '../utils/db'

const checkAdmin = async (req: Request, res: Response) => {
    const { user, password } = req.body;

    if (user !== 'admin' || password !== 'admin') {
        return res.json({ admin: false });
    }

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 15);

    try {
        const session = await prisma.session.create({
            data: {
                expiresAt: expirationTime
            },
        }); 
        return res.json({ admin: true, sessionId: session.id });
    } catch (error) {
        console.error('Error creating session:', error);
        return res.status(500).json({ error: 'Failed to create session' });
    }
};

export default checkAdmin