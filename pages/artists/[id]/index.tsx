import { ActionIcon, AspectRatio, Card, Grid, Group, Image, Stack, Text, Title } from "@mantine/core"
import { Album, Artist, Music } from "@prisma/client"
import dayjs from "dayjs"
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
                    <Stack m={'1rem'} style={{ alignSelf: 'flex-end' }} spacing={3}>
                        <Title style={{ color:'white', textShadow: "0 0 0.25rem rgb(0 0 0 / 40%)" }} order={1}>{artist.name}</Title>
                        <Title style={{ color:'white', textShadow: "0 0 0.25rem rgb(0 0 0 / 40%)", fontWeight: 'normal' }} order={4}>{artist.altName}</Title>
                    </Stack>
                </div>
            </div>
            <div style={{ margin: '1rem' }}>
                <Group position="apart">
                    <Title sx={(theme) => ({ color: theme.colorScheme === 'dark' ? "white" : "black" })} order={3}>Songs</Title>
                    <Link passHref href={`/artists/${artist.id}/songs`}>
                        <ActionIcon component="a" color={'blue'}><svg xmlns="http://www.w3.org/2000/svg" width={'20px'} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></ActionIcon>
                    </Link>
                </Group>
                <Stack pt={'md'}>
                    <MusicsList artist={artist} setPlayerState={setPlayerState} queue={queue} setQueue={setQueue} playerState={playerState} />
                </Stack>
                <Group pt={'lg'} position="apart">
                    <Title sx={(theme) => ({ color: theme.colorScheme === 'dark' ? "white" : "black" })} order={3}>Albums / Singles</Title>
                    <Group spacing={3}>
                        <Link passHref href={`/artists/${artist.id}/albums/new`}>
                            <ActionIcon component="a" variant="light" color={'blue'}><svg xmlns="http://www.w3.org/2000/svg" width={'20px'} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg></ActionIcon>
                        </Link>
                        <ActionIcon color={'blue'}><svg xmlns="http://www.w3.org/2000/svg" width={'20px'} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></ActionIcon>
                    </Group>
                </Group>
                <Grid pt={'md'} columns={20}>
                    {artist.albums.map((e: Album) => {
                        return<Grid.Col key={e.id} span={10} lg={5} xl={20/6} sm={20/3}>
                            <Link passHref href={`/albums/${e.id}`}>
                                <Card component="a">
                                    <Card.Section>
                                        <AspectRatio style={{ backgroundImage:`url(/api/files/${e.albumArt}?q=75&w=512)`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#000000' }} ratio={1/1}>
                                            <img style={{ objectFit: 'contain', backdropFilter: 'blur(0.5rem) brightness(0.5)' }} src={`/api/files/${e.albumArt}?q=75&w=512`}/>
                                        </AspectRatio>
                                    </Card.Section>
                                    <Card.Section p={'sm'} pt={'xs'}>
                                        <Text><b>{e.name}</b></Text>
                                        <Text>{dayjs(e.releaseDate).format('MM-YYYY')}</Text>
                                    </Card.Section>
                                </Card>
                            </Link>
                        </Grid.Col>
                    })}
                </Grid>
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
                take: 6,
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
                take: 5,
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