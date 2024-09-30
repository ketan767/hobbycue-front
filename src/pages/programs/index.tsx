const index = ({}) => {
  return null
}

export async function getServerSideProps() {
  return {
    redirect: {
      permanent: false,
      destination: '/explore/programs',
    },
  }
}

export default index
