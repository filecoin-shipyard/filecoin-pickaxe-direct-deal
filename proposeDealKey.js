import React, { useEffect, useContext } from 'react'
import { Box, StdinContext } from 'ink'
import BundleContext from './bundleContext'
import DealRequestsContext from './dealRequestsContext'

export default function ProposeDealKey ({ ask }) {
  const { stdin, setRawMode } = useContext(StdinContext)
  const { loading, cid } = useContext(BundleContext)
  const dealRequests = useContext(DealRequestsContext)

  useEffect(() => {
    if (!dealRequests) return
    const { shared } = dealRequests
    setRawMode(true)
    stdin.on('data', handleKey)
    return () => { stdin.removeListener('data', handleKey) }
    
    function handleKey (data) {
      if (data === 'p' && !loading) {
        // console.log('Proposed deal', cid, ask)
        const record = {
          timestamp: Date.now(),
          cid,
          ask
        }
        const minerKey = `${ask.miner}_${ask.id}`
        shared.applySub(
          minerKey, 'ormap', 'applySub',
          `dealRequest`, 'mvreg', 'write',
          JSON.stringify(record)
        )
      }
    }
  }, [ask, loading, cid, dealRequests])

  return null
}
