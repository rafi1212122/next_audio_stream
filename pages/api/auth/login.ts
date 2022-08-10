import { User } from "@prisma/client";
import * as argon2 from "argon2";
import Joi from "joi";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../helpers/prismaConnect'
import jwt from 'jsonwebtoken';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if(req.cookies._token)return res.status(400).json({ message: "already logged in" })
    switch(req.method){
        case'POST':
            const registerSchema = Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required(),
            })
            const { error, value: body } = registerSchema.validate(req.body)
            if(error)return res.status(400).json({ message: error.details[0].message })

            let user = await prisma.user.findFirst({
                where: {
                    username: body.username
                }
            })
            if(!user)return res.status(400).json({ message: "user doesnt exist" })
            if(!await argon2.verify(user.password, body.password))return res.status(401).json({ message: "wrong password" })
            const token = jwt.sign({
                sub: user.id,
                username: user.username,
                level: user.level
            }, process.env.JWT_SECRET_KEY, {
                expiresIn: '3d'
            })
            let expDate = new Date()
            expDate.setDate(expDate.getDate()+3)
            res.setHeader('Set-Cookie', `_token=${token}; path=/; expires=${expDate.toUTCString()}; SameSite=Strict; HttpOnly`)
            return res.json({ message: 'success!' })
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}
