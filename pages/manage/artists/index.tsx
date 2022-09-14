import { ActionIcon, Button, Table, Pagination } from "@mantine/core";
import { Artist } from "@prisma/client";
import axios from "axios";
import Head from "next/head"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Explore() {
    const [artists, setArtists] = useState([])
    const [artistsCount, setArtistsCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(()=> {
        getArtists()
    }, [currentPage])
    
    const getArtists = async () => {
        await axios.get(`/api/manage/artists?p=${currentPage-1}`).then((data)=> {
            setArtists(data.data.artists)
            setArtistsCount(data.data.count)
        }).catch((err)=>console.log(err))
    }

    return(
        <div style={{ margin: '1rem' }}>
            <Head>
                <title>Manage Artists</title>
            </Head>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link passHref href={'/manage/artists/create'}>
                    <Button component="a" leftIcon={<svg xmlns="http://www.w3.org/2000/svg" width={20} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>}>Create Artist</Button>
                </Link>
            </div>
            <Table highlightOnHover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Alternative Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {artists.map((i: Artist)=> {
                        return(
                            <tr key={i.id}>
                                <td>{i.id}</td>
                                <td>{i.name}</td>
                                <td>{i.altName}</td>
                                <td>
                                    <Link passHref href={`/manage/artists/${i.id}`}>
                                        <ActionIcon component="a" color={'green'} variant="filled">
                                            <svg xmlns="http://www.w3.org/2000/svg" width={18} viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                                        </ActionIcon>
                                    </Link>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            {artistsCount>15&&<Pagination page={currentPage} onChange={setCurrentPage} pt={'1rem'} total={Math.ceil(artistsCount/15)} withEdges/>}
        </div>
    );
}
