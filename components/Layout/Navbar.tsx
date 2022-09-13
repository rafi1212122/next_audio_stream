import { AspectRatio, Navbar as MantineNavbar, NavLink, Stack } from "@mantine/core"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import DataContext from "../../helpers/DataContext"

export default function Navbar() {
    const { profile, queue } = useContext(DataContext)
    const [manageLink, setManageLink] = useState(false)
    const router = useRouter()

    return(
        <MantineNavbar
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
        </MantineNavbar>
    )
}