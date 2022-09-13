import { AppShell, Navbar, Header, Group, ActionIcon, Stack, Anchor, Text, Slider, Footer, Menu, NavLink, Image, AspectRatio } from '@mantine/core';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import DataContext from '../helpers/DataContext';
import { useDocumentVisibility, useMediaQuery, useTimeout } from '@mantine/hooks';
import useHover from '../helpers/useHover';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }){
    const [manageLink, setManageLink] = useState(false)
    const [volumeRef, isVolumeHovered] = useHover()
    const [progressRef, isProgressHovered] = useHover()
    const {playerState, setPlayerState, queue, setQueue, profile, themeOverride, setThemeOverride} = useContext(DataContext)
    const playerRef = useRef<HTMLVideoElement>(null)
    const router = useRouter()
    const smallScreen = useMediaQuery('(max-width: 630px)');
    const documentState = useDocumentVisibility()
    const { start, clear } = useTimeout(() => {
        setPlayerState(playerState=>({...playerState, isSeeking: false}))
    }, 2000);

    useEffect(()=>{
        if(router.pathname.split('/')[1]==='manage'){
            setManageLink(true)
        }else{
            setManageLink(false)
        }
    }, [router.asPath])
    
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

    useEffect(()=>{
        if(queue.length>0){
            setPlayerState(playerState=>({...playerState, max: playerRef.current.duration}))
        }
    }, [])
    
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
        if(documentState==='hidden'||playerState.isSeeking){
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
                            <Menu.Label>Theme</Menu.Label>
                            <Menu.Item onClick={()=>setThemeOverride(2)} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width={20}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>}>Dark</Menu.Item>
                            <Menu.Item onClick={()=>setThemeOverride(1)} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>}>Light</Menu.Item>
                            <Menu.Item onClick={()=>setThemeOverride(0)} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" /></svg>}>System</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Header>
            }
            footer={
                <Footer styles={(theme) => ({
                    root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1], borderTop:`1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[4]}` },
                })} height={90}>
                    <video onEnded={handleEnd} onDurationChange={()=>setPlayerState(playerState=>({...playerState, max: playerRef.current.duration}))} onTimeUpdate={handleTimeUpdate} onPause={()=>setPlayerState(playerState=>({...playerState, isPlaying: false}))} onPlay={()=>setPlayerState(playerState=>({...playerState, isPlaying: true}))} ref={playerRef} controls style={{ display: 'none' }} src={queue[0]?.url||''} poster={queue[0]?.poster||''} autoPlay></video>
                    <Group style={{ height:'100%', justifyContent: 'flex-start' }} px={'0.5rem'}>
                        <Stack style={{ flex: 1 }} spacing={0} justify={'space-around'}>
                            <Link passHref href={`/albums/${queue[0]?.albumId}`}>
                                <Text component='a' sx={{ ':hover': { textDecoration: 'underline' }, cursor: 'pointer' }} size='lg'><b>{queue[0]&&`${queue[0]?.title} ${queue[0]?.altTitle&&`(${queue[0]?.altTitle})`}`}</b></Text>
                            </Link>
                            <Group spacing={0}>
                            {queue[0]?.artists?.map((a: any, index: any)=>
                                <Link key={a.id} passHref href={`/artists/${a.id}`}>
                                    <Anchor sx={(theme)=>({
                                        color: theme.colorScheme==='dark' ? theme.colors.gray[5] : theme.colors.gray[7],
                                        '&:hover':{
                                            color: theme.colorScheme==='dark' ? theme.colors.gray[2] : 'black',
                                            fontWeight: 500
                                        }
                                    })} component='a'>
                                        {index<queue[0]?.artists?.length&&index!==0?", ":""}{a.name}
                                    </Anchor>
                                </Link>
                            )}
                            </Group>
                        </Stack>
                        <Stack style={{ flex: 1.3 }} align={'center'} justify={'center'} spacing={1}>
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
                        <Group style={{ flex: 1, justifyContent: 'end' }} ref={volumeRef} spacing={10}>
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
            navbar={!smallScreen&&
                <Navbar
                styles={(theme) => ({
                    root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0] },
                })} width={{ base: 250 }} style={{ display: 'flex', flexDirection: 'column', justifyContent:'space-between' }} height={'calc(100vh - 150px)'}>
                    <Stack p={5} spacing={3}>
                        <Link href="/" passHref>
                            <NavLink component='a' style={{ borderRadius: '0.25rem' }} icon={<svg width={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>} active={router.pathname==='/'}  label="Home" />
                        </Link>
                        <Link href="/explore" passHref>
                            <NavLink component='a' style={{ borderRadius: '0.25rem' }} icon={<svg width={20} xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-safari" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><polyline points="8 16 10 10 16 8 14 14 8 16"></polyline><circle cx="12" cy="12" r="9"></circle></svg>} active={router.pathname==='/explore'}  label="Explore" />
                        </Link>
                        {profile&&profile.level==='ADMIN'&&<>
                        <NavLink
                            style={{ borderRadius: '0.25rem' }}
                            label="Manage"
                            opened={manageLink}
                            onClick={()=>setManageLink(initial=>!initial)}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width={20} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>}
                            childrenOffset={10}
                        >
                            <Link href="/manage/musics" passHref>
                                <NavLink component='a' style={{ borderRadius: '0.25rem' }} icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={20}><path fillRule="evenodd" d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V9.017 5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z" clipRule="evenodd" /></svg>} active={router.pathname==='/manage/musics'} label="Musics" />
                            </Link>
                            <Link href="/manage/albums" passHref>
                                <NavLink component='a' style={{ borderRadius: '0.25rem' }} icon={<svg xmlns="http://www.w3.org/2000/svg" width={20} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="1"></circle><path d="M7 12a5 5 0 0 1 5 -5"></path><path d="M12 17a5 5 0 0 0 5 -5"></path></svg>} active={router.pathname==='/manage/albums'} label="Albums" />
                            </Link>
                            <Link href="/manage/artists" passHref>
                                <NavLink my={3} component='a' style={{ borderRadius: '0.25rem' }} icon={<svg xmlns="http://www.w3.org/2000/svg" width={20} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" /></svg>} active={router.pathname==='/manage/artists'} label="Artists" />
                            </Link>
                        </NavLink>
                        </>
                        }
                    </Stack>
                    <AspectRatio style={{ backgroundImage:`url(${queue[0]?.poster||''})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#000000' }} ratio={1 / 1}>
                        <img style={{ objectFit: 'contain', backdropFilter: 'blur(0.5rem) brightness(0.5)' }} src={queue[0]?.poster||'data:image/jpeg;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}/>
                    </AspectRatio>
                </Navbar>
            }
            styles={(theme) => ({
                root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2] },
            })}
            padding={0}
        >
            {children}
        </AppShell>
    )
  }