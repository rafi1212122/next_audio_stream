import { Button, Card, FileButton, Group, Input, LoadingOverlay, Select, Text, Title } from "@mantine/core"
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { GetServerSidePropsContext } from "next"
import Head from "next/head"
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { prisma } from '../../../../helpers/prismaConnect'

export default function ArtistNewAlbum({ artist }) {
    const [submitting, setSubmitting] = useState(false)
    const [file, setFile] = useState<File | null>(null);
    const [base64File, setBase64File] = useState("");
    const [nameInput, setNameInput] = useState("");
    const [dateInput, setDateInput] = useState("");
    const [typeInput, setTypeInput] = useState("ALBUM");
    const router =  useRouter()

    useEffect(()=> {
        if(!file)return setBase64File("")
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setBase64File(String(reader.result));
        };
    }, [file])

    const submitHadler = async () => {
        if(!base64File){
            return showNotification({
                id: 'create-album-error',
                title: "Error!",
                message: "No image selected",
                color: 'red',
                radius: 'xs',
            });
        }
        setSubmitting(true)
        await axios.post('/api/albums', {
            name: nameInput,
            type: typeInput,
            releaseDate: dateInput,
            artistId: artist.id,
            image: base64File,
        }).then((response) => {
            showNotification({
                id: 'create-album-error',
                title: "Success!",
                message: response.data.message,
                color: 'green',
                radius: 'xs',
            });
            return router.push(`/artists/${router.query.id}`)
        }).catch((err)=>{
            if(err.response.status!==400&&err.response.status!==403){
                return showNotification({
                    id: 'create-album-error',
                    title: "Error!",
                    message: err.response.statusText,
                    color: 'red',
                    radius: 'xs',
                });
            }
            return showNotification({
                id: 'create-album-error',
                title: "Error!",
                message: err?.response?.data?.message,
                color: 'red',
                radius: 'xs',
            });
        })
        setSubmitting(false)
    }

    return(
        <div style={{ margin: '1rem' }}>
            <Head>
                <title>{`Add ${artist.name} New Album / Single`}</title>
            </Head>
            <Card shadow="sm" p="sm" radius="md">
                <Card.Section p={'sm'}>
                    <Title sx={(theme) => ({ color: theme.colorScheme === 'dark' ? "white" : "black" })} order={3}>{`Add ${artist.name} New Album / Single`}</Title>
                </Card.Section>
                <Card.Section sx={(theme)=> ({
                    borderTop: '1px solid',
                    borderBottom: '1px solid',
                    borderColor: theme.colorScheme==='dark'?theme.colors.gray[7]:theme.colors.gray[3]
                })} style={{ position:'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem' }} px='md' py={'sm'}>
                    <LoadingOverlay loaderProps={{ size: 'md', color: 'blue', variant: 'oval' }} visible={submitting} overlayBlur={2} />
                    <Input.Wrapper id={'name'} label="Name">
                        <Input autoComplete="off" mt={'0.1rem'} required id={'name'} type='text' placeholder="Name" value={nameInput} onChange={(e:ChangeEvent<any>) => setNameInput(e.target.value)}/>
                    </Input.Wrapper>
                    <Select
                        label="Album Type"
                        styles={{ input: { marginTop: '0.1rem' } }}
                        value={typeInput}
                        onChange={setTypeInput}
                        placeholder="Select Album Type"
                        data={[
                            { value: 'SINGLE', label: 'Single' },
                            { value: 'ALBUM', label: 'Album' },
                        ]}
                    />
                    <Input.Wrapper id={'date'} label="Release Date">
                        <Input autoComplete="off" mt={'0.1rem'} required id={'date'} type='date' placeholder="Release Date" value={dateInput} onChange={(e:ChangeEvent<any>) => setDateInput(e.target.value)}/>
                    </Input.Wrapper>
                    <img style={{ maxHeight: '300px', objectFit: 'contain', maxWidth: '300px', marginTop: '0.5rem' }} src={base64File}/>
                    <Group mt={'0.5rem'}>
                        <FileButton onChange={setFile} accept="image/*">
                            {(props) => <Button {...props}>Upload image</Button>}
                        </FileButton>
                        <Text size="sm">{file?`Selected file: ${file.name}`:"No file selected"}</Text>
                    </Group>
                </Card.Section>
                <Card.Section style={{ display: 'flex', justifyContent: 'space-between' }} p={'sm'}>
                    <Link passHref href={`/artists/${artist.id}`}>
                        <Button color={'gray'} variant='outline' component="a" type='submit'>Back</Button>
                    </Link>
                    <Button onClick={submitHadler}>Submit</Button>
                </Card.Section>
            </Card>
        </div>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    return{
      props: {
        artist: JSON.parse(JSON.stringify(await prisma.artist.findFirst({
            where: {
                id: String(ctx.params.id)
            }
        })))
      }
    }
  }