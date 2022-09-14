import { AppShell, Navbar, Group, ActionIcon, Stack, Anchor, Text, Slider, Footer, Header } from '@mantine/core';
import { Suspense, useContext, useEffect, useRef, useState } from 'react';
import DataContext from '../../helpers/DataContext';
import { useDocumentVisibility, useMediaQuery, useTimeout } from '@mantine/hooks';
import useHover from '../../helpers/useHover';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(() => import('./Header'), {
  suspense: true
})

const DynamicNavbar = dynamic(() => import('./Navbar'), {
  suspense: true
})

export default function Layout({ children }){
    const [manageLink, setManageLink] = useState(false)
    const [playerProgress, setPlayerProgress] = useState(0)
    const [volumeRef, isVolumeHovered] = useHover()
    const [progressRef, isProgressHovered] = useHover()
    const {playerState, setPlayerState, queue, setQueue} = useContext(DataContext)
    const playerRef = useRef<HTMLVideoElement>(null)
    const router = useRouter()
    const documentState = useDocumentVisibility()
    const smallScreen = useMediaQuery('(max-width: 630px)');
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
        setPlayerProgress(e)
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
        setPlayerProgress(playerRef.current.currentTime?Math.ceil(playerRef.current.currentTime):0)
    }

    const handleEnd = () => {
        if(playerState.isLooping){
            setPlayerState(playerState=>({...playerState, isPlaying: true}))
        }else {
            setQueue(queue.slice(1))
        }
    }

    useEffect(()=> {
        if (queue.length>0&&'mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: queue[0]&&`${queue[0]?.title} ${queue[0]?.altTitle&&`(${queue[0]?.altTitle})`}`,
                artist: queue[0]?.artists?.map((a: any, index: any)=>`${index<queue[0]?.artists?.length&&index!==0?", ":""}${a.name}`),
                album: queue[0]?.albumName,
                artwork: [
                    { src: queue[0]?.poster+'&w=128', sizes: '128x128', type: 'image/webp' },
                    { src: queue[0]?.poster+'&w=256', sizes: '256x256', type: 'image/webp' },
                    { src: queue[0]?.poster, sizes: '512x512', type: 'image/webp' },
                ],
            });
            navigator.mediaSession.setActionHandler('nexttrack', handleNext);
            navigator.mediaSession.setActionHandler("seekforward", handleMediaSessionSeek);
            navigator.mediaSession.setActionHandler("seekbackward", handleMediaSessionSeek);
        }
    }, [queue])

    const handleNext = () => {
        setQueue(queue.slice(1))
    }

    const handleMediaSessionSeek = async (details: MediaSessionActionDetails) => {
        await setPlayerState(playerState=>({...playerState, isSeeking: true}))
        switch(details.action){
            case "seekforward":
                playerRef.current.currentTime = Math.min(playerRef.current.currentTime+10, playerRef.current.duration)
                break
            case "seekbackward":
                playerRef.current.currentTime = Math.max(playerRef.current.currentTime-10, 0)
                break
        }
        setPlayerState(playerState=>({...playerState, isSeeking: false}))
    }

    return(
        <AppShell
            header={<Suspense fallback={<Header px={'xl'} styles={(theme) => ({
                root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0] } })} height={60}><></></Header>}>
                <DynamicHeader smallScreen={smallScreen}/>
              </Suspense>
            }
            footer={
                <Footer styles={(theme) => ({
                    root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1], borderTop:`1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[4]}` },
                })} height={90}>
                    <video onEnded={handleEnd} onDurationChange={()=>setPlayerState(playerState=>({...playerState, max: playerRef.current.duration}))} onTimeUpdate={handleTimeUpdate} onPause={()=>setPlayerState(playerState=>({...playerState, isPlaying: false}))} onPlay={()=>setPlayerState(playerState=>({...playerState, isPlaying: true}))} ref={playerRef} controls style={{ display: 'none' }} src={queue[0]?.url||''} poster={queue[0]?.poster||''} autoPlay></video>
                    <Group style={{ height:'100%', justifyContent: 'flex-start' }} px={'0.5rem'}>
                        <Group style={{ flex: smallScreen?2:1 }}>
                            {smallScreen&&<img style={{ objectFit: 'contain', backdropFilter: 'blur(0.5rem) brightness(0.5)', width: 'calc(90px - 1.5rem)', height: 'calc(90px - 1.5rem)', borderRadius: '0.2rem' }} src={queue[0]?.poster||'data:image/jpeg;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}/>}
                            <Stack style={{ maxWidth: smallScreen?'calc(66vw - calc(90px + 1rem))':'initial' }} spacing={0} justify={'space-around'}>
                                <Link passHref href={`/albums/${queue[0]?.albumId}`}>
                                    <Text component='a' sx={{ ':hover': { textDecoration: 'underline' }, cursor: 'pointer' }} size='lg'><b>{queue[0]&&`${queue[0]?.title} ${(queue[0]?.altTitle&&!smallScreen)?`(${queue[0]?.altTitle})`:""}`}</b></Text>
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
                        </Group>
                        <Stack style={{ flex: 1.3, display: smallScreen?'none':'flex' }} align={'center'} justify={'center'} spacing={1}>
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
                                        {new Date(playerProgress * 1000||0).toISOString().substring(14, 19)}
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
                                    }} size={'sm'} style={{ width: '25vw' }} disabled={queue.length<1} onChangeEnd={handleSliderChangeEnd} onChange={handleSliderChange} label={null} max={playerState.max} value={playerProgress}/>
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
                            }} labelTransition={'pop'} labelTransitionDuration={150} disabled={playerState.isMuted} min={0} size={'sm'} max={100} style={{ width: smallScreen?'20vw':'7vw' }} value={playerState.volume} onChange={(val)=>setPlayerState(playerState=>({...playerState, volume:val}))}/>
                        </Group>
                    </Group>
                </Footer>
            }
            navbar={<Suspense fallback={<Navbar
                styles={(theme) => ({
                    root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0] },
                })} width={{ base: 250 }} height={'calc(100vh - 150px)'}>
                </Navbar>}><DynamicNavbar manageLink={manageLink} setManageLink={setManageLink}/></Suspense>
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