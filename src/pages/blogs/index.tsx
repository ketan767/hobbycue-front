const index = ({}) => {
  return null
}

export async function getServerSideProps() {
  return {
    redirect: {
      permanent: false,
      destination: '/blog',
    },
  }
}

export default index
