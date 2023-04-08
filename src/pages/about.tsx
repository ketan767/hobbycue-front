import { withAuth } from '@/navigation/withAuth'
import React from 'react'

type Props = {}

function about({}: Props) {
  return <div>about</div>
}

export default withAuth(about)
