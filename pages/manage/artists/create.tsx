import { Button, Input, MultiSelect } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import Head from "next/head"
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

export default function Explore() {
    const [artistName, setArtistName] = useState("")
    const [altName, setAltName] = useState("")
    const formRef = useRef<HTMLFormElement>(null)
    const router = useRouter()

    const onFormSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            await axios.post('/api/manage/artists', {
                name: artistName,
                alt_name: altName
            })
        } catch (err) {
            return showNotification({
                id: 'artist-error',
                title: "Error!",
                message: err?.response?.data?.message,
                color: 'red',
                radius: 'xs',
            });
        }
        showNotification({
            id: 'artist-success',
            title: "Success!",
            message: "Successfuly created",
            color: 'green',
            radius: 'xs',
        });
        return router.push('/manage/artists')
    }

    return(
        <div style={{ margin: '1rem' }}>
            <Head>
                <title>Create Artist</title>
            </Head>
            <form ref={formRef} onSubmit={onFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Input.Wrapper required id={'artist_name'} label={"Name"}>
                    <Input onChange={(e: ChangeEvent<HTMLInputElement>)=>setArtistName(e.target.value)} value={artistName} autoComplete="off" mt={'0.1rem'} required id={'artist_name'} type='text' placeholder={"artist name"}/>
                </Input.Wrapper>
                <Input.Wrapper id={'alt_name'} label={"Alternative Name"}>
                    <Input onChange={(e: ChangeEvent<HTMLInputElement>)=>setAltName(e.target.value)} value={altName} autoComplete="off" mt={'0.1rem'} id={'alt_name'} type='text' placeholder={"alternative name"}/>
                </Input.Wrapper>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </div>
    );
}
