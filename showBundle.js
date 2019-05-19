import path from 'path'
import React, { useState, useEffect } from 'react'
import { Box, Color } from 'ink'
import GroupContext from './groupContext'

function Bundle ({ bundle, bundleImports }) {
  const { name, sources } = JSON.parse(bundle)
  const { base } = path.parse(sources[0].file)
  const biv = bundleImports.shared.value()
  let cid
  if (biv[name]) {
    const times = Object.keys(biv[name])
      .map(time => Number(time))
      .sort()
    const last = biv[name][times[times.length - 1]]
    if (last) {
      const importRecord = JSON.parse([...last][0])
      cid = <Box>
        {' '}
        {`${importRecord.sources[0].single}`}
      </Box>
    }
  }
  return (
    <Box>
      <Color cyan>{name}:</Color>
      <Color yellow>{' ' + base}</Color>
      {cid}
    </Box>
  )
}

function BundleWithImports ({ group }) {
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
    <Bundle
      bundle={bundle}
      bundleImports={bundleImports} />
  )
}

export default function ShowBundle () {
  return (
    <GroupContext.Consumer>
      {
        group => {
          if (!group) {
            return <Box>Loading...</Box>
          } else {
            return <BundleWithImports group={group} />
          }
        }
      }
    </GroupContext.Consumer>
  )
}

