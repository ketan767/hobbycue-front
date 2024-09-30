const index = ({}) => {
  return null
}

export async function getServerSideProps() {
  return {
    redirect: {
      permanent: false,
      destination: '/explore/places',
    },
  }
}

export default index
