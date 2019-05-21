import path from 'path'
import React, { useState, useEffect, useContext } from 'react'
import { Box, Color } from 'ink'
import prettyBytes from 'pretty-bytes'
import GroupContext from './groupContext'

function Bundle ({ bundleName, filenameBase, cid, size }) {
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

function SelectBundle ({ bundle, bundleImports }) {
  const { name, sources } = JSON.parse(bundle)
  const { base } = path.parse(sources[0].file)
  const biv = bundleImports.shared.value()
  let cid, size
  if (biv[name]) {
    const times = Object.keys(biv[name])
      .map(time => Number(time))
      .sort()
    const last = biv[name][times[times.length - 1]]
    if (last) {
      const importRecord = JSON.parse([...last][0])
      cid = importRecord.sources[0].single
      size = importRecord.sources[0].stats.size
    }
  }
  return (
    <Bundle
      bundleName={name}
      filenameBase={base}
      cid={cid}
      size={size} />
  )
}

export default function ShowBundle () {
  const group = useContext(GroupContext)
  const [bundle, setBundle] = useState()
  const [bundleImports, setBundleImports] = useState()

  useEffect(() => {
    if (!group) return
    let unmounted = false
    const bundles = group.collaboration.shared.value()
    if (bundles.length === 0) return
    setBundle(bundles[bundles.length - 1])
    async function run () {
      const loaded = await group.bundleImports()
      if (!unmounted) {
        setBundleImports(loaded)
      }
    }
    run()
    return () => { umounted = true }
  }, [group])

  if (!bundle || !bundleImports) return <Box>Loading...</Box>

  return (
    <SelectBundle
      bundle={bundle}
      bundleImports={bundleImports} />
  )
}

