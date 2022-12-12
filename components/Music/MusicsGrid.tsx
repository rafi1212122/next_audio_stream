import React, { useContext, useState } from "react";
import { Grid, Card, Stack, Image, Text, ActionIcon, Transition } from '@mantine/core'
import Link from "next/link";
import DataContext from "../../helpers/DataContext";


export default function MusicsGrid({musics}) {
    return (
        <Grid pt={'md'} columns={10}>
        {musics?.map((i)=>{
            return<MusicCol music={i}/>
        })}
        </Grid>
    )
}

export function MusicCol({music}) {
    const { playerState, queue, setPlayerState, setQueue } = useContext(DataContext)
    const [hovered, setHovered] = useState(false);

    return (
        <Grid.Col onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} pos={'relative'} key={music.id} span={5} sm={10/3} md={10/4} xl={10/6}>
            <Link passHref href={`/albums/${music.album.id}`}>
                <Card component="a" shadow="sm" p="sm" radius="md" withBorder>
                    <Stack spacing={0} style={{ alignItems: 'flex-start' }}>
                        <Image height={'7rem'} width={'7rem'} radius={'sm'} src={`/api/files/${music.album.albumArt}?q=75&w=256`}/>
                        <Stack spacing={0} pt={'sm'}>
                            <Text lineClamp={1} weight={500}>{`${music.title} ${music.altTitle&&`(${music.altTitle})`}`}</Text>
                            <Text lineClamp={1} size="sm" color="dimmed">{music.artists.map((artist: any, index: any)=>`${index<music.artists.length&&index!==0?", ":""}${`${artist.name} ${`${artist.altName&&`(${artist.altName})`}`}`}`)}</Text>
                        </Stack>
                    </Stack>
                </Card>
            </Link>
            <Transition mounted={hovered||queue[0]?.id===music.id} transition={'pop-bottom-right'}>
                {(styles)=><ActionIcon onClick={()=>queue[0]?.id===music.id?setPlayerState(playerState=>({...playerState, isPlaying: !playerState.isPlaying})):setQueue([{ id: music.id, url: `/api/files/${music.resourceKey}`, poster: `/api/files/${music.album.albumArt}?q=75&w=512`, title: music.title, altTitle: music.altTitle, artists: music.artists, albumId: music.album.id , albumName: music.album.name}])} style={{ ...styles, height:42, width:42 }} color={'blue'} sx={()=>({
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                })} variant="light">
                    {playerState.isPlaying&&queue[0]?.id===music.id?
                    <svg style={{ height:42, width:42 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>:
                    <svg style={{ height:42, width:42 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    }
                </ActionIcon>}
            </Transition>
        </Grid.Col>
    )
}
    