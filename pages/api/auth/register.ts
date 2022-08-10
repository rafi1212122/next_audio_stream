import { User } from "@prisma/client";
import * as argon2 from "argon2";
import Joi from "joi";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../helpers/prismaConnect'

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if(req.cookies._token)return res.status(400).json({ message: "already logged in" })
    switch(req.method){
        case'POST':
            const registerSchema = Joi.object({
                username: Joi.string().pattern(/^[a-zA-Z0-9_]*$/).min(3).max(32).required().messages({
                    "string.pattern.base": "only alphanumeric characters and dashes is allowed in username!"
                }),
                password: Joi.string().min(6).required(),
                confirm_password: Joi.any().valid(Joi.ref('password')).required().messages({
                    "any.only" : "password confirmation must match!"
                })
            })
            const { error, value: body } = registerSchema.validate(req.body)
            if(error)return res.status(400).json({ message: error.details[0].message })
            let user:User
            try {
                user = await prisma.user.create({
                    data: {
                        username: body.username,
                        password: await argon2.hash(body.password, {timeCost: 32, parallelism: 2})
                    }
                })
            } catch (error) {
                if(error.code==='P2002'){
                    return res.status(400).json({ message: 'username already in use', code: error.code })
                }
                return res.status(400).json({ message: 'unknown error!', code: error.code })
            }
            return res.json({ message: 'success!', user})
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}
