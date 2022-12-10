import { ActionIcon, Card, CloseButton, Drawer, Group, Image, Slider, Stack, Text } from "@mantine/core"
import Link from "next/link"

export default function QueueDrawer({ queueDrawerState, setQueueDrawerState, smallScreen, handleNext, queue, playerState, playerProgress, handleSliderChangeEnd, handleSliderChange, setPlayerState, setQueue }) {

    return(
        <Drawer
        opened={queueDrawerState}
        onClose={() => setQueueDrawerState(false)}
        padding="md"
        size="xl"
        withinPortal={false}
        position="bottom"
        zIndex={2000}
        transitionDuration={100}
        styles={{
            drawer: {
                overflowY: 'scroll'
            }
        }}
      >
        {queue[0]?<>
        <Text weight="bold">Now Playing</Text>
        <Card mt={'0.5rem'}>
            <Card.Section withBorder p={'sm'}>
                <Stack spacing={0}>
                    <Group spacing={'sm'} noWrap style={{ alignItems: 'flex-start' }}>
                        <Image height={'5rem'} width={'5rem'} radius={'sm'} src={queue[0]?.poster}/>
                        <Stack spacing={0}>
                            <Link href={`/albums/${queue[0]?.albumId}`} passHref>
                                <Text sx={()=>({
                                    ':hover': {
                                        textDecoration: 'underline'
                                    }
                                })} lineClamp={1} onClick={()=>setQueueDrawerState(false)} component="a" weight={'bold'}>{`${queue[0]?.title} ${(queue[0]?.altTitle)?`(${queue[0]?.altTitle})`:""}`}</Text>
                            </Link>
                            <Group spacing={0}>
                            {queue[0]?.artists?.map((a: any, index: any)=>
                                <Link key={a.id} href={`/artists/${a.id}`} passHref>
                                    <Text sx={()=>({
                                        ':hover': {
                                            textDecoration: 'underline'
                                        }
                                    })} size="sm" onClick={()=>setQueueDrawerState(false)} component="a" color="dimmed">{index<queue[0]?.artists?.length&&index!==0?", ":""}{a.name}</Text>
                                </Link>
                            )}
                            </Group>
                        </Stack>
                    </Group>
                    {smallScreen&&<>
                    <Group style={{ alignSelf: 'center' }} spacing={0}>
                        <ActionIcon style={{ height:20, width:20, opacity: playerState.isLooping?1:0.5 }} onClick={()=>setPlayerState(playerState=>({...playerState, isLooping: !playerState.isLooping}))}>
                            <svg style={{ height:20, width:20 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                            </svg>
                        </ActionIcon>
                        <ActionIcon style={{ height:36, width:36 }} onClick={()=>setPlayerState(playerState=>({...playerState, isPlaying: !playerState.isPlaying}))}>
                            {playerState.isPlaying?
                            <svg style={{ height:36, width:36 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>:
                            <svg style={{ height:36, width:36 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            }
                        </ActionIcon>
                        <ActionIcon onClick={()=>handleNext()} style={{ height:24, width:24 }}>
                            <svg style={{ height:24, width:24 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                            </svg>
                        </ActionIcon>
                    </Group>
                    <Group noWrap>
                        <Text style={{ cursor:'default' }} size="sm">
                            {new Date(playerProgress * 1000||0).toISOString().substring(14, 19)}
                        </Text>
                        <Slider style={{ flexGrow: 1 }} styles={{
                            track: {
                                "&:before": {
                                    right: 0,
                                    left: 0,
                                },
                            },
                        }} size={'sm'}  onChangeEnd={handleSliderChangeEnd} onChange={handleSliderChange} disabled={queue.length<1} label={null} max={playerState.max} value={playerProgress}/>
                        <Text style={{ cursor:'default' }} size="sm">
                            {new Date(playerState.max * 1000||0).toISOString().substring(14, 19)}
                        </Text>
                    </Group>
                    </>}
                </Stack>
            </Card.Section>
        </Card>
        </>:<Text weight="bold">Nothing is Playing</Text>}
        {queue[1]&&<>
        <Text mt={'md'} weight="bold">Up Next</Text>
        <Card mt={'0.5rem'}>
        {queue[1]&&queue.slice(1).map((el: any, index)=>{
            return<Card.Section key={index} withBorder p={'sm'}>
                <Group noWrap position="apart">
                    <Group spacing={'sm'} noWrap style={{ alignItems: 'center' }}>
                        <ActionIcon onClick={()=>handleNext(index+1)} color={'blue'}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={20}><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg></ActionIcon>
                        <Image height={'3.5rem'} width={'3.5rem'} radius={'sm'} src={el?.poster}/>
                        <Stack spacing={0}>
                            <Link passHref href={`/albums/${el.albumId}`}>
                                <Text sx={()=>({
                                    ':hover': {
                                        textDecoration: 'underline'
                                    }
                                })} lineClamp={1} onClick={()=>setQueueDrawerState(false)} component="a" weight={'bold'}>{`${el?.title} ${(el?.altTitle)?`(${el?.altTitle})`:""}`}</Text>
                            </Link>
                            <Group spacing={0}>
                            {el?.artists?.map((a: any, index: any)=>
                                <Link href={`/artists/${a.id}`} key={a.id} passHref>
                                    <Text sx={()=>({
                                        ':hover': {
                                            textDecoration: 'underline'
                                        }
                                    })} onClick={()=>setQueueDrawerState(false)} component='a' size="sm" color="dimmed">{index<el?.artists?.length&&index!==0?", ":""}{a.name}</Text>
                                </Link>
                            )}
                            </Group>
                        </Stack>
                    </Group>
                    <CloseButton color={'red'} onClick={() => setQueue(prevValue => prevValue.filter((val) => val.id!==el.id ))}/>
                </Group>
        </Card.Section>
        })}
        </Card>
        </>}
      </Drawer>
    )
}