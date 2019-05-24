import crypto from 'crypto'
import { promisify } from 'util'
import React, { useEffect, useContext } from 'react'
import { Box, StdinContext } from 'ink'
import BundleContext from './bundleContext'
import DealRequestsContext from './dealRequestsContext'

const randomBytes = promisify(crypto.randomBytes)

export default function ProposeDealKey ({ ask }) {
  const { stdin, setRawMode } = useContext(StdinContext)
  const { loading, cid } = useContext(BundleContext)
  const { dealRequests, minerDealRequests } = useContext(DealRequestsContext)

  useEffect(() => {
    if (!dealRequests) return
    setRawMode(true)
    stdin.on('data', handleKey)
    return () => { stdin.removeListener('data', handleKey) }
    
    async function handleKey (data) {
      if (data === 'p' && !loading) {
        // console.log('Proposed deal', cid, ask)
        const record = {
          timestamp: Date.now(),
          cid,
          ask
        }
        const minerAskId = `${ask.miner}_${ask.id}`
        const dealId = minerAskId + '_' + (await randomBytes(8)).toString('hex')
        dealRequests.shared.applySub(
          dealId, 'ormap', 'applySub',
          `dealRequest`, 'mvreg', 'write',
          JSON.stringify(record)
        )
        minerDealRequests.shared.applySub(minerAskId, 'mvreg', 'write', dealId)
      }
    }
  }, [ask, loading, cid, dealRequests])

  return null
}
