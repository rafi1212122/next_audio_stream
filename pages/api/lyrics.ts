import { NextApiRequest, NextApiResponse } from "next";
import { getLyrics, LyricsOutput } from "lyrics-dumper";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import cache from "../../helpers/cache";
import { prisma } from '../../helpers/prismaConnect'

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    switch(req.method){
        case'GET':
            if(!req.query.id||typeof req.query.id !== 'string'){
                return res.status(400).json({ message: 'invalid id!' })
            }
            if(await cache('get', `lyric-${req.query.id}`)) return res.json(await cache('get', `lyric-${req.query.id}`))
            const music = await prisma.music.findFirst({
                where: {
                    id: req.query.id
                },
                include: {
                    artists: {
                        select: {
                            name: true
                        }
                    }
                }
            })
            if(!music) return res.status(400).json({ message: 'invalid id!' })
            let result: LyricsOutput
            try {
                result = await getLyrics(`${music.title} ${music.artists[0].name}`)
            } catch (error) {
                return res.status(404).json({ message: 'lyrics not found!' })
            }
            const kuroshiro = new Kuroshiro();
            await kuroshiro.init(new KuromojiAnalyzer());
            result.lyrics = await kuroshiro.convert(result.lyrics, { to: 'romaji', mode: 'spaced' })
            await cache('set', `lyric-${req.query.id}`, result)
            return res.json(result)
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}
