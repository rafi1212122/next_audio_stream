import { InputWrapper, Input, ActionIcon } from "@mantine/core"
import { useContext, useRef, useState } from "react"
import DataContext from "../helpers/DataContext"

export default function Home() {
  const [playerState, setPlayerState, sound, queue, setQueue] = useContext(DataContext)
  const addToQueueInputRef = useRef(null)

  const addToQueue = async () => {
    if(!addToQueueInputRef.current.value){
      return
    }
    let loopingState = playerState.isLooping
    await setPlayerState(playerState=>({...playerState, isLooping:queue.length!==0?true:false}))
    await setQueue(queue.concat(addToQueueInputRef.current.value))
    await setPlayerState(playerState=>({...playerState, isLooping:loopingState}))
    addToQueueInputRef.current.value = ''
  }

  return (
    <div>
      <InputWrapper id="add" label={'Add to queue'}>
        <Input ref={addToQueueInputRef} rightSection={<ActionIcon onClick={addToQueue}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </ActionIcon>} id="add" placeholder="audio url"/>
      </InputWrapper>
    </div>
  )
}
