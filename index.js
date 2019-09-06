#!/usr/bin/env node

import meow from 'meow'
import React, { useState, useEffect } from 'react'
import { render, Box, Color } from 'ink'
import { mineshaftStart, mineshaftStop } from '@jimpick/filecoin-pickaxe-mineshaft'
import { ConnectMineshaft } from '@jimpick/filecoin-pickaxe-mineshaft-context'
import { SelectBundle } from './bundleContext'
import { WatchDealRequests } from './dealRequestsContext'
import useFilecoinConfig from '@filecoin-shipyard/use-filecoin-config'
import useFilecoinHead from '@filecoin-shipyard/use-filecoin-head'
import useFilecoinNetworkInfo from '@filecoin-shipyard/use-filecoin-network-info'
import useFilecoinAsks from '@jimpick/use-filecoin-asks'
import InkWatchForExitKey from '@jimpick/ink-watch-for-exit-key'
import Bundle from './bundle'
import Duration from './duration'
import Scrollable from './scrollable'
import AsksAndDealRequests from './asksAndDealRequests'

const cli = meow(
  `
    Usage
      $ filecoin-pickaxe-direct-deal [options]

    Options:

      --duration <blocks>
      -d <blocks>

        Deal duration in blocks (approx 30 seconds each)
  `,
  {
    flags: {
      duration: {
        alias: 'd',
        type: 'string'
      }
    }
  }
)

const args = cli.flags

const duration = Number(args.duration) || 2880

const Main = () => {
  const [, nickname] = useFilecoinConfig('heartbeat.nickname')
  const [, , height, updateTime] = useFilecoinHead({
    interval: 5000
  })
  const [, netName, , netHeight] = useFilecoinNetworkInfo({
    interval: 30000
  })
  const [unfilteredAsks] = useFilecoinAsks()
  const asks = unfilteredAsks &&
    unfilteredAsks.filter(ask => ask.expiry > height + duration)

  const { columns, rows } = process.stdout

  if (!updateTime) {
    return <Box>Loading...</Box>
  }

  const seconds = (
    <Box>
      ({Math.floor((Date.now() - updateTime) / 1000)}s ago)
    </Box>
  )

  const netInfo = (
    <Box>
      {netName}: {netHeight >= 0 ? netHeight : 'Loading...'}
    </Box>
  )

  const content = (
    <WatchDealRequests>
      <Scrollable
        height={rows - 5}
        dataLength={asks && asks.length}
        render={
          ({ height, scrollTop, cursorIndex }) => {
            return (
              <AsksAndDealRequests
                asks={asks}
                height={height}
                scrollTop={scrollTop}
                cursorIndex={cursorIndex}
                duration={duration} />
            )
          }
        } />
    </WatchDealRequests>
  )

  return (
    <ConnectMineshaft>
      <SelectBundle>
        <Box flexDirection="column" width={columns} height={rows - 1}>
          <Box>
            <Box flexGrow={1}>
              <Color green>Filecoin Pickaxe Direct Deal</Color>
            </Box>
            <Box>
              {asks && `${asks.length} asks`}
            </Box>
          </Box>
          <Bundle />
          <Duration duration={duration} height={height} />
          {content}
          <Box>
            <Box>
              {nickname && nickname + ' '}
            </Box>
            <Box flexGrow={1}>
              {height} {seconds}
            </Box>
            <Box>
              <Box>{netInfo}</Box>
            </Box>
          </Box>
          <InkWatchForExitKey />
        </Box>
      </SelectBundle>
    </ConnectMineshaft>
  )
}

async function run () {
  await mineshaftStart('filecoin-pickaxe')

  const { rerender, waitUntilExit } = render(<Main/>)

  process.on('SIGWINCH', () => rerender(<Main/>))

  try {
    await waitUntilExit()
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

run()
