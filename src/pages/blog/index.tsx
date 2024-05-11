import { redirect } from 'next/navigation'

const index = ({}) => {
  return null
}

export async function getServerSideProps() {
  return {
    redirect: {
      permanent: false,
      destination: 'https://blog.hobbycue.com/blog',
    },
  }
}

export default index
