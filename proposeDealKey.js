import React, { useEffect, useContext } from 'react'
import { Box, AppContext, StdinContext } from 'ink'
import BundleContext from './bundleContext'

function ProposeDealKey ({ stdin, setRawMode, exit }) {
  const { loading, cid } = useContext(BundleContext)

  useEffect(() => {
    setRawMode(true)
    stdin.on('data', handleData)
    return () => { stdin.removeListener('data', handleData) }
    
    function handleData (data) {
      if (data === 'p' && !loading) {
        console.log('Proposed deal', cid)
      }
    }
  }, [loading, cid])

  return null
}

export default function ProposeDealKeyWithStdin () {
  return (
    <AppContext.Consumer>
      {({ exit }) => (
        <StdinContext.Consumer>
          {({stdin, setRawMode}) => (
            <ProposeDealKey
              stdin={stdin}
              setRawMode={setRawMode}
              exit={exit}/>
          )}
        </StdinContext.Consumer>
      )}
    </AppContext.Consumer>
  )
}
