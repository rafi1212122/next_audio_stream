import { AppShell, Navbar, Header, Group, ActionIcon, Stack, Anchor, Text, Slider, Footer, Menu, NavLink } from '@mantine/core';
import { useContext, useEffect, useRef, useState } from 'react';
import DataContext from '../helpers/DataContext';
import { useTimeout } from '@mantine/hooks';
import useHover from '../helpers/useHover';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }){
    const [volumeRef, isVolumeHovered] = useHover()
    const [progressRef, isProgressHovered] = useHover()
    const [playerState, setPlayerState, queue, setQueue, profile] = useContext(DataContext)
    const playerRef = useRef<HTMLVideoElement>(null)
    const router = useRouter()
    const { start, clear } = useTimeout(() => {
        setPlayerState(playerState=>({...playerState, isSeeking: false}))
    }, 2000);

    useEffect(()=>{
        if(playerState.isPlaying){
            playerRef.current.play()
        }else{
            playerRef.current.pause()
        }
    }, [playerState.isPlaying])

    useEffect(()=>{
        if(playerState.isMuted){
            playerRef.current.muted = true
        }else{
            playerRef.current.muted = false
        }
    }, [playerState.isMuted])

    useEffect(()=>{
        playerRef.current.volume = playerState.volume/100
    }, [playerState.volume])

    // useEffect(()=>{
    //     setPlayerState(playerState=>({...playerState, max: playerRef.current.duration}))
    // }, [])
    
    const handleSliderChange = (e: number) => {
        clear()
        setPlayerState(playerState=>({...playerState, isSeeking: true}))
        setPlayerState(playerState=>({...playerState, progress: e}))
        start()
    }

    const handleSliderChangeEnd = (e: number) => {
        setPlayerState(playerState=>({...playerState, isSeeking: false}))
        playerRef.current.currentTime = e
    }

    const handleTimeUpdate = () => {
        if(playerState.isSeeking){
            return
        }
        setPlayerState(playerState=>({ ...playerState, progress: playerRef.current.currentTime?Math.ceil(playerRef.current.currentTime):0 }))
    }

    const handleEnd = () => {
        if(playerState.isLooping){
            setPlayerState(playerState=>({...playerState, isPlaying: true}))
        }else {
            setQueue(queue.slice(1))
        }
    }

    const handleNext = () => {
        setQueue(queue.slice(1))
    }

    return(
        <AppShell
            header={
                <Header px={'xl'} style={{ zIndex:1000, display: 'flex', justifyContent: 'flex-end', 'alignItems': 'center' }} styles={(theme) => ({
                    root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0] },
                })} height={60}>
                    <Menu position='bottom-end' shadow="md" width={200}>
                        <Menu.Target>
                            <ActionIcon size={'lg'} color='blue' variant='light'>
                                <svg xmlns="http://www.w3.org/2000/svg" width={20} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                            {/* <Menu.Label>Application</Menu.Label>
                            <Menu.Item icon={<IconSett size={14} />}>Settings</Menu.Item>
                            <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
                            <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item>
                             */}
                            {/* <Menu.Label>Danger zone</Menu.Label> */}
                            {profile?
                            <Menu.Item component='a' href='/api/auth/logout' data-danger color="red" icon={<svg xmlns="http://www.w3.org/2000/svg" width={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>}>
                                Logout
                            </Menu.Item>:
                            <Link href={'/login'} passHref>
                                <Menu.Item component={'a'} icon={<svg xmlns="http://www.w3.org/2000/svg" width={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>}>
                                    Login
                                </Menu.Item>
                            </Link>
                            }
                        </Menu.Dropdown>
                    </Menu>
                </Header>
            }
            footer={
                <Footer styles={(theme) => ({
                    root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1], borderTop:`1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[4]}` },
                })} height={90}>
                    <video onEnded={handleEnd} onDurationChange={()=>setPlayerState(playerState=>({...playerState, max: playerRef.current.duration}))} onTimeUpdate={handleTimeUpdate} onPause={()=>setPlayerState(playerState=>({...playerState, isPlaying: false}))} onPlay={()=>setPlayerState(playerState=>({...playerState, isPlaying: true}))} ref={playerRef} controls style={{ display: 'none' }} src={queue[0]?.url||''} poster={queue[0]?.poster||''} autoPlay></video>
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
                                <ActionIcon onClick={handleNext} style={{ height:24, width:24 }}>
                                    <svg style={{ height:24, width:24 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                                    </svg>
                                </ActionIcon>
                            </Group>
                            <div ref={progressRef}>
                                <Group spacing={10}>
                                    <Text style={{ cursor:'default' }} size="sm">
                                        {new Date(playerState.progress * 1000||0).toISOString().substring(14, 19)}
                                    </Text>
                                    <Slider styles={{
                                        thumb: {
                                            backgroundColor: "white",
                                            opacity: isProgressHovered ? 1 : 0,
                                        },
                                        track: {
                                            "&:before": {
                                                right: 0,
                                                left: 0,
                                            },
                                        },
                                    }} size={'sm'} style={{ width: '25vw' }} disabled={queue.length<1} onChangeEnd={handleSliderChangeEnd} onChange={handleSliderChange} label={null} max={playerState.max} value={playerState.progress}/>
                                    <Text style={{ cursor:'default' }} size="sm">
                                        {queue.length<1?new Date(0).toISOString().substring(14, 19):new Date(playerState.max * 1000||0).toISOString().substring(14, 19)}
                                    </Text>
                                </Group>
                            </div>
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
                </Footer>
            }
            navbar={
                <Navbar
                styles={(theme) => ({
                    root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0] },
                })} width={{ base: 250 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }} p={5} height={'calc(100vh - 150px)'}>
                    <Link href="/" passHref>
                        <NavLink component='a' style={{ borderRadius: '0.25rem' }} icon={<svg width={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>} active={router.pathname==='/'}  label="Home" />
                    </Link>
                    <Link href="/explore" passHref>
                        <NavLink component='a' style={{ borderRadius: '0.25rem' }} icon={<svg width={20} xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-safari" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><polyline points="8 16 10 10 16 8 14 14 8 16"></polyline><circle cx="12" cy="12" r="9"></circle></svg>} active={router.pathname==='/explore'}  label="Explore" />
                    </Link>
                </Navbar>
            }
            styles={(theme) => ({
                root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2] },
            })}
        >
            {children}
        </AppShell>
    )
  }