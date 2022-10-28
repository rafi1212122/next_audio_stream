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
    </div>
  )
}
