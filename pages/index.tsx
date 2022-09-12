import { Input, ActionIcon } from "@mantine/core"
import { getHotkeyHandler } from "@mantine/hooks"
import Head from "next/head"
import { useContext, useEffect, useRef, useState } from "react"
import DataContext from "../helpers/DataContext"

export default function Home() {
  const { setQueue, queue } = useContext(DataContext)
  const addToQueueInputRef = useRef(null)

  const addToQueue = async () => {
    if(!addToQueueInputRef.current.value){
      return
    }
    await setQueue(queue.concat({url: addToQueueInputRef.current.value}))
    addToQueueInputRef.current.value = ''
  }

  return (
    <div style={{ margin: '1rem' }}>
      <Head>
        <title>Home</title>
      </Head>
      <Input.Wrapper id="add" label={'Add to queue'}>
        <Input autoComplete="off" onKeyDown={getHotkeyHandler([
            ['Enter', addToQueue],
          ])} ref={addToQueueInputRef} rightSection={<ActionIcon onClick={addToQueue}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </ActionIcon>} id="add" placeholder="audio url"/>
      </Input.Wrapper>   
    </div>
  )
}
