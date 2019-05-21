import React, { useContext } from 'react'
import { Box, Color } from 'ink'
import prettyBytes from 'pretty-bytes'
import BundleContext from './bundleContext'

export default function Bundle () {
  const {
    loading,
    bundleName,
    filenameBase,
    cid,
    size
  } = useContext(BundleContext)

  if (loading) return <Box>Loading...</Box>

  let cidAndSize
  if (cid) {
    cidAndSize = <Box>
      <Color magenta>
        {` ${prettyBytes(size)}`}
      </Color>
      {` ${cid}`}
    </Box>
  }
  return (
    <Box>
      <Color cyan>{bundleName}:</Color>
      <Color yellow>{` ${filenameBase}`}</Color>
      {cidAndSize}
    </Box>
  )
}
