import { ActionIcon, Card, Group, Stack, Text } from "@mantine/core"
import Link from "next/link"

export default function MusicsList({artist, queue, setQueue, setPlayerState, playerState}) {
    return(
        <Card>
        {artist.musics.map((e: any, index) => {
            return<Card.Section key={e.id} withBorder p={'sm'} pt={'xs'}>
                    <Group position="apart">
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
                        <Text size={'sm'} color={"dimmed"}>{e.streams}</Text>
                    </Group>
                </Card.Section>
        })}
        </Card>
    )
}