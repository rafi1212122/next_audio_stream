import axios, { AxiosResponse } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../helpers/prismaConnect'

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    switch(req.method){
        case'POST':
            const { type, data } = req.body
            switch(type){
                case"streams":
                    const { captchaRes, musicId } = data
                    if(!captchaRes||!musicId) return res.status(400).json({ message: "musicId & captchaRes required!" })
                    await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captchaRes}`).catch(()=> {
                        return res.json({ message: 'report validation failed' })
                    }).then(async ({ data }: AxiosResponse)=>{
                        if(data.score>=0.5){
                            await prisma.music.update({
                                where: {
                                    id: musicId
                                },
                                data: {
                                    streams: { increment: 1 }
                                }
                            })
                        }
                        return res.json(data)
                    })
                    break
                default:
                    return res.status(400).json({ message: "invalid type!" })
            }
            break
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}