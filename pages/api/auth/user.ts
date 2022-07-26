import Joi from "joi";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../helpers/prismaConnect'
import jwt from 'jsonwebtoken';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if(!req.cookies._token)return res.status(400).json({ message: "you need to be logged in!" })
    switch(req.method){
        case'GET':
            let decodedJwt:any
            try {
                decodedJwt = jwt.verify(req.cookies._token, process.env.JWT_SECRET_KEY)
            } catch (error) {
                res.setHeader('Set-Cookie', '_token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT')
                return res.status(401).json({ error })
            }
            let user = await prisma.user.findFirst({
                where: {
                    id: String(decodedJwt.sub)
                },
                select: {
                    id: true,
                    username: true,
                    level: true,
                    createdAt: true,
                    updatedAt: true,
                }
            })
            if(decodedJwt.level!==user.level||decodedJwt.username!==user.username){
                res.setHeader('Set-Cookie', '_token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT')
            }
            return res.json({ user, decodedJwt })
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}
