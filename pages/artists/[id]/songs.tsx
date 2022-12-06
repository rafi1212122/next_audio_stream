import { ActionIcon, AspectRatio, Card, Grid, Group, Image, Stack, Text, Title } from "@mantine/core"
import { Album, Artist, Music } from "@prisma/client"
import { GetServerSidePropsContext } from "next"
import Head from "next/head"
import Link from "next/link"
import { useContext } from "react"
import MusicsList from "../../../components/Music/MusicsList"
import DataContext from "../../../helpers/DataContext"
import { prisma } from '../../../helpers/prismaConnect'

export default function ArtistPage({ artist }) {
    const { setQueue, queue, setPlayerState, playerState } = useContext(DataContext)

    return(
        <div>
            <Head>
                <title>{`${artist.name} ${artist.altName&&`(${artist.altName})`}`}</title>
            </Head>
            <div style={{ backgroundImage: `url(${artist.albums.length>0?`/api/files/${artist.albums[0].albumArt}?q=75&w=512`:"https://dummyimage.com/512x512/555/555"})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'top', backgroundColor: '#000000' }}>
                <div style={{ minHeight: '25vh', display: 'flex', backdropFilter: 'blur(0.3rem) brightness(0.7)' }}>
                    <Stack style={{ justifyContent: 'space-between' }} m={'1rem'}>
                        <Link href={`/artists/${artist.id}`} passHref>
                            <ActionIcon component="a" variant={"filled"} sx={(theme)=>({
                                backgroundColor: theme.colorScheme==='dark'?theme.colors.dark[9] : theme.colors.gray[0],
                                color: theme.colorScheme==='light'?theme.colors.dark[9] : theme.colors.gray[0],
                                ':hover': {
                                    backgroundColor: theme.colorScheme==='dark'?theme.colors.dark[6] : theme.colors.gray[3]
                                }
                            })} size={'lg'}><svg width={22} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg></ActionIcon>
                        </Link>
                        <Stack style={{ alignSelf: 'flex-end' }} spacing={3}>
                            <Title style={{ color:'white', textShadow: "0 0 0.25rem rgb(0 0 0 / 40%)" }} order={1}>{artist.name}</Title>
                            <Title style={{ color:'white', textShadow: "0 0 0.25rem rgb(0 0 0 / 40%)", fontWeight: 'normal' }} order={4}>{artist.altName}</Title>
                        </Stack>
                    </Stack>
                </div>
            </div>
            <div style={{ margin: '1rem' }}>
                <Group position="apart">
                    <Title sx={(theme) => ({ color: theme.colorScheme === 'dark' ? "white" : "black" })} order={3}>Songs</Title>
                </Group>
                <Stack pt={'md'}>
                    <MusicsList artist={artist} setPlayerState={setPlayerState} queue={queue} setQueue={setQueue} playerState={playerState} />
                </Stack>
            </div>
        </div>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const artistData = await prisma.artist.findFirst({
        where: {
            id: String(ctx.params.id)
        },
        include: {
            albums: {
                take: 1,
                select: {
                    albumArt: true
                },
                orderBy: {
                    releaseDate: 'desc'
                },
                where: {
                    approved: true
                }
            },
            musics: {
                where: {
                    approved: true
                },
                orderBy: {
                    streams: 'desc'
                },
                include: {
                    artists: {
                        select: {
                            name: true,
                            id: true
                        }
                    },
                    album: {
                        select: {
                            id: true,
                            name: true,
                            albumArt: true,
                        }
                    }
                }
            }
        }
    })

    if(!artistData) return{
        notFound: true
    }

    return{
      props: {
        artist: JSON.parse(JSON.stringify(artistData, (key, value) => (typeof value === 'bigint' ? value.toString() : value)))
      }
    }
  }