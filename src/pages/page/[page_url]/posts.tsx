// pages/page/[page_url].tsx

import { getListingPages } from '@/services/listing.service'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context

  const { err, res } = await getListingPages(
    `page_url=${query['page_url']}&populate=_hobbies,_address,seller,product_variant`,
  )

  if (err || !res) {
    return {
      notFound: true,
    }
  }

  const typeMap: { [key: number]: string } = {
    1: 'people',
    2: 'place',
    3: 'program',
    4: 'product',
  }

  const pageType = typeMap[res?.data?.data?.listings[0]?.type]

  if (pageType) {
    return {
      redirect: {
        destination: `/${pageType}/${query['page_url']}/posts`,
        permanent: false,
      },
    }
  }
  return {
    notFound: true,
  }
}

export default function Page() {
  return null
}
