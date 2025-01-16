const index = ({}) => {
  return null
}

export async function getServerSideProps() {
  return {
    redirect: {
      permanent: false,
      destination: '/add-listing',
    },
  }
}

export default index
