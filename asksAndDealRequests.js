import React, { useMemo, useContext } from 'react'
import { Box, Color } from 'ink'
import figures from 'figures'
import BigNumber from 'bignumber.js'
import prettyMs from 'pretty-ms'
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
  const now = Date.now()
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
            if (dealRequest.dealRequest.cid === cid) {
              const { agentState, errorMsg, deal } = dealRequest
              if (agentState) {
                const { state } = agentState
                if (state === 'dealFailed' && errorMsg) {
                  dealRequestInfo = <Color red>{errorMsg.errorMsg}</Color>
                } else if (state === 'dealSuccess' && deal) {
                  dealRequestInfo = <Color green>Deal: {deal.dealId}</Color>
                } else if (state === 'queued') {
                  dealRequestInfo = <Color grey>Queued</Color>
                } else if (state === 'ack') {
                  dealRequestInfo = <Color grey>Acknowledged</Color>
                } else if (state === 'proposing') {
                  dealRequestInfo = <Color yellow>Proposing...</Color>
                } else {
                  dealRequestInfo = state
                }
              } else {
                dealRequestInfo = 'Requested'
                const elapsed = now - dealRequest.dealRequest.timestamp
                if (elapsed > 10000) {
                  dealRequestInfo += ` ${prettyMs(elapsed)} ago`
                }
              }
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

