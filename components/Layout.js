import { AppShell, Navbar, Header, Group, ActionIcon, Stack, Anchor, Text, Slider } from '@mantine/core';
import { useContext, useState } from 'react';
import DataContext from '../helpers/DataContext';
import useHover from '../helpers/useHover';

export default function Layout({ children }){
    const [volumeRef, isVolumeHovered] = useHover()
    const [progressRef, isProgressHovered] = useHover()
    const [playerState, setPlayerState, sound, queue, setQueue] = useContext(DataContext)

    return(
        <AppShell
            header={
                <Header styles={(theme) => ({
                    root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0] },
                })} height={60}></Header>
            }
            footer={
                <Header styles={(theme) => ({
                    root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1], borderTop:`1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[4]}` },
                })} height={90}>
                    <Group style={{ height:'100%', padding:15 }} position='apart'>
                        <Stack spacing={0} justify={'space-around'}>
                            <Text size='lg' weight={500}>Title</Text>
                            <Anchor sx={(theme)=>({
                                color: theme.colorScheme==='dark' ? theme.colors.gray[5] : theme.colors.gray[7],
                                '&:hover':{
                                    color: theme.colorScheme==='dark' ? theme.colors.gray[2] : 'black',
                                    fontWeight: 500
                                }
                            })} component='a'>
                                Artist
                            </Anchor>
                        </Stack>
                        <Stack align={'center'} justify={'center'} spacing={1}>
                            <Group spacing={0}>
                                <ActionIcon style={{ height:20, width:20, opacity: playerState.isLooping?1:0.5 }} onClick={()=>setPlayerState(playerState=>({...playerState, isLooping:!playerState.isLooping}))}>
                                    <svg style={{ height:20, width:20 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                                    </svg>
                                </ActionIcon>
                                <ActionIcon style={{ height:36, width:36 }} onClick={()=>setPlayerState(playerState=>({...playerState, isPlaying:!playerState.isPlaying}))}>
                                    {playerState.isPlaying?
                                    <svg style={{ height:36, width:36 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>:
                                    <svg style={{ height:36, width:36 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                    }
                                </ActionIcon>
                                <ActionIcon onClick={()=>{
                                        if(playerState.isLooping){
                                            return
                                        }
                                        sound?.unload()
                                        setQueue(queue.slice(1))
                                    }} style={{ height:24, width:24 }}>
                                    <svg style={{ height:24, width:24 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                                    </svg>
                                </ActionIcon>
                            </Group>
                            <Group spacing={10}>
                                <Text size='sm'>{sound?new Date(sound?.seek() * 1000).toISOString().substring(14, 19):''}</Text>
                                <Slider ref={progressRef} styles={{ 
                                    thumb: { backgroundColor: 'white', opacity: isProgressHovered?1:0 },
                                    track: { '&:before': { right: 0, left: 0 } }
                                 }} draggable={'false'} showLabelOnHover={false} label={null} value={sound?.seek()} onChange={val=>sound.seek(val)} size={'sm'} max={sound?.duration()} style={{ width:'25vw' }}/>
                                <Text size='sm'>{sound?new Date(sound?.duration() * 1000).toISOString().substring(14, 19):''}</Text>
                            </Group>
                        </Stack>
                        <Group ref={volumeRef} spacing={10}>
                            <ActionIcon style={{ height:20, width:20 }} onClick={()=>setPlayerState(playerState=>({...playerState, isMuted:!playerState.isMuted}))}>
                                {playerState.isMuted?
                                <svg style={{ height:20, width:20 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>:
                                <svg style={{ height:20, width:20 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                </svg>
                                }
                            </ActionIcon>
                            <Slider styles={{
                                thumb: { backgroundColor: 'white', opacity: isVolumeHovered?1:0 },
                                track: { margin: 0, '&:before': { right: 0, left: 0 } }
                            }} labelTransition={'pop'} labelTransitionDuration={150} disabled={playerState.isMuted} min={0} size={'sm'} max={100} style={{ width:'7vw' }} value={playerState.volume} onChange={(val)=>setPlayerState(playerState=>({...playerState, volume:val}))}/>
                        </Group>
                    </Group>
                </Header>
            }
            navbar={
                <Navbar
                styles={(theme) => ({
                    root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0] },
                })} width={{ base: 300 }} height={'calc(100vh - 150px)'}></Navbar>
            }
            styles={(theme) => ({
                root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2] },
            })}
        >
            {children}
        </AppShell>
    )
}