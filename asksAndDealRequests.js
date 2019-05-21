import React, { useMemo } from 'react'
import { Box, Color } from 'ink'
import figures from 'figures'
import BigNumber from 'bignumber.js'

export default function AsksAndDealRequests ({
  height,
  scrollTop,
  cursorIndex,
  asks,
  minerDealRequests
}) {
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
        if (minerDealRequests[minerDealRequestKey]) {
          dealRequestInfo = minerDealRequests[minerDealRequestKey]
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
  return <>{rows}</>
}
