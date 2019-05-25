import React, { useMemo, useContext } from 'react'
import { Box, Color } from 'ink'
import figures from 'figures'
import BigNumber from 'bignumber.js'
import ProposeDealKey from './proposeDealKey'
import BundleContext from './bundleContext'
import DealRequestsContext from './dealRequestsContext'

export default function AsksAndDealRequests ({
  height,
  scrollTop,
  cursorIndex,
  asks,
  duration
}) {
  const { loading, cid } = useContext(BundleContext)
  const {
    dealRequests: { values: dealRequests },
    minerDealRequests: { values: minerDealRequests }
  } = useContext(DealRequestsContext)
  const sortedAsks = useMemo(
    () => (asks && asks.sort((a, b) => BigNumber(a.price).comparedTo(b.price))),
    [asks]
  )
  const rows = []
  if (asks) {
    for (let i = 0; i < sortedAsks.length; i++) {
      if (i >= scrollTop && i < scrollTop + height) {
        const ask = sortedAsks[i]
        const pointer = (i === cursorIndex) ? figures.pointer : ' '
        let dealRequestInfo
        const minerDealRequestKey = `${ask.miner}_${ask.id}`
        if (minerDealRequests && minerDealRequests[minerDealRequestKey]) {
          const dealRequestId = minerDealRequests[minerDealRequestKey]
          if (dealRequests && dealRequests[dealRequestId]) {
            const dealRequest = dealRequests[dealRequestId]
            dealRequestInfo = 'Requested, ' + dealRequest.dealRequest.timestamp
            if (dealRequest.agentState) {
              dealRequestInfo += `, ${dealRequest.agentState.state}`
            }
          }
        }
        rows.push(
          <Box textWrap="truncate" key={i}>
            {pointer}{' '}
            <Color cyan>{`${i + 1}`.padStart(3)}</Color>{' '}
            <Color blue>{ask.miner}</Color>{' '}
            <Color blue>{`${ask.id}`.padEnd(2)}</Color>{' '}
            <Color yellow>{`${ask.price}`.padEnd(22)}</Color>{' '}
            <Color gray>{`${ask.expiry}`.padEnd(10)}</Color>
            {dealRequestInfo}
          </Box>
        )
      }
    }
  }
  return (
    <>
      <ProposeDealKey
        key="keyboard"
        ask={sortedAsks[cursorIndex]}
        duration={duration} />
      {rows}
    </>
  )
}

