import { ActionIcon, AspectRatio, Card, Grid, Group, Image, Stack, Text, Title } from "@mantine/core"
import { Album, Artist, Music } from "@prisma/client"
import { GetServerSidePropsContext } from "next"
import Head from "next/head"
import Link from "next/link"
import { useContext } from "react"
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
                    <Card>
                    {artist.musics.map((e: any, index) => {
                        return<Card.Section key={e.id} withBorder p={'sm'} pt={'xs'}>
                                <Group>
                                    <ActionIcon onClick={()=>queue[0]?.id===e.id?setPlayerState(playerState=>({...playerState, isPlaying: !playerState.isPlaying})):setQueue(artist.musics.slice(index).map((e)=>{return{ id: e.id, url: `/api/files/${e.resourceKey}`, poster: `/api/files/${e.album.albumArt}?q=75&w=512`, title: e.title, altTitle: e.altTitle, artists: e.artists, albumId: e.album.id , albumName: e.album.name}}))} size={'lg'} color={'blue'}>{(queue[0]?.id===e.id&&playerState.isPlaying)?<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={'22px'}><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" /></svg>:<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={'22px'}><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>}</ActionIcon>
                                    <Stack spacing={0}>
                                        <Text><b>{`${e.title} ${e.altTitle&&`(${e.altTitle})`}`}</b></Text>
                                        <Group spacing={0}>
                                        {e.artists.map((a: any, index: any)=>
                                            <Link key={a.id} passHref href={`/artists/${a.id}`}>
                                                <Text sx={{
                                                    ":hover": {
                                                        textDecoration: 'underline'
                                                    }
                                                }} component="a" size={'xs'}>{index<e.artists.length&&index!==0?", ":""}{a.name}</Text>
                                            </Link>
                                        )}
                                        </Group>
                                    </Stack>
                                </Group>
                            </Card.Section>
                    })}
                    </Card>
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