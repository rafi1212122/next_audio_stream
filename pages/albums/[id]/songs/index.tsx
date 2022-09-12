import { GetServerSidePropsContext } from "next"

export default function AlbumSongs() {
  return<></>
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
    return {
      redirect: {
        destination: `/albums/${ctx.params.id}`,
        permanent: true,
      },
    }
  }