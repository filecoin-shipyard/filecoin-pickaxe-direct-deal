import path from 'path'
import React, { useState, useEffect, useContext } from 'react'
import GroupContext from './groupContext'

const BundleContext = React.createContext()

function SelectBundleWithImports ({ children, bundle, bundleImports }) {
  if (!bundle || !bundleImports) {
    return (
      <BundleContext.Provider value={{ loading: true }}>
        {children}
      </BundleContext.Provider>
    )
  }
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
  const value = {
    bundleName: name,
    filenameBase: base,
    cid,
    size
  }
  return (
    <BundleContext.Provider value={value}>
      {children}
    </BundleContext.Provider>
  )
}

export function SelectBundle ({ children }) {
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

  return (
    <SelectBundleWithImports bundle={bundle} bundleImports={bundleImports}>
      {children}
    </SelectBundleWithImports>
  )
}

export default BundleContext

