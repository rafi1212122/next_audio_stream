import Head from "next/head"
import { useEffect, useRef, useState } from "react";

export default function Explore() {
    const [src, setSrc] = useState([{ url: 'https://musicdex.org/storage/track_media/rWrHqPGCzdA7K5jNEHmOTzbxhK51eijoYNlwOa3I.mp3', poster: 'https://storj.rafi12.cyou/storage/ShareX/2022/07/Cover.jpg'}, { url: 'https://musicdex.org/storage/track_media/DjLWGcSzszAIlqPAV7QF2KYG71sSPDBnc364FVIX.mp3', poster: 'https://storj.rafi12.cyou/storage/ShareX/2022/07/FYtTAWwVUAAWwrH.png'}])
    const playerRef = useRef<HTMLVideoElement>(null)
    const [playingState, setPlayingState] = useState<Boolean>()

    useEffect(()=>{
        console.log('src')
    }, [playerRef?.current?.paused])
  
    return(
        <div>
            <video onPause={()=>setPlayingState(false)} onPlay={()=>setPlayingState(true)} ref={playerRef} controls style={{ display: 'none' }} src={src[0].url} poster={src[0].poster} autoPlay></video>
            <button onClick={()=>setSrc(src.slice(1))}>next</button>
            <button onClick={()=>(playerRef.current.currentTime > 0 && !playerRef.current.paused && !playerRef.current.ended && playerRef.current.readyState > 2)?playerRef.current.pause():playerRef.current.play()}>play / pause</button>
            <p>status: {playingState?'playing':'paused'}</p>
        </div>
    );

  return (
    <div>
      <Head>
        <title>Explore</title>
      </Head>
      
    </div>
  )
}
