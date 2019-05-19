import React, { useState, useEffect } from 'react'
import { Box, Text, StdinContext } from 'ink'
import figures from 'figures'

function Scrollable ({ height, render, onCursorScrollHandler, dataLength }) {
  const [updateTime, setUpdateTime] = useState()
  const [cursorIndex, setCursorIndex] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)

  const contentHeight = height - 2
  const { columns } = process.stdout

  const loading = !(typeof dataLength === 'number')

  useEffect(() => {
    onCursorScrollHandler({ setCursorAndScroll })

    function setCursorAndScroll (offset) {
      if (!loading) {
        const newCursorIndex = cursorIndex + offset
        if (newCursorIndex >= 0 && newCursorIndex <= dataLength - 1) {
          setCursorIndex(newCursorIndex)
          if (newCursorIndex < scrollTop) {
            setScrollTop(newCursorIndex)
          }
          if (newCursorIndex > scrollTop + contentHeight - 1) {
            setScrollTop(newCursorIndex - contentHeight + 1)
          }
          setUpdateTime(Date.now())
        }
      }
    }
  }, [height, scrollTop, cursorIndex, dataLength])

  if (loading) {
    dataLength = 1
    render = () => <Box>Loading...</Box>
  }

  const paddingRows = []
  if (dataLength < contentHeight) {
    for (let i = 0; i < contentHeight - dataLength; i++) {
      paddingRows.push(<Box> </Box>)
    }
  }

  let topBorder = '-'.repeat(6) +
    'Miner'.padEnd(42, '-') +
    'ID'.padEnd(3, '-') +
    'Price'.padEnd(23, '-') +
    'Expiry'
  topBorder += '-'.repeat(Math.max(columns - topBorder.length, 0))
  if (scrollTop > 0) {
    const linesAbove = `${scrollTop}`
    topBorder = topBorder.slice(0,1) +
      (figures.arrowUp + linesAbove).padStart(4, '-') +
      topBorder.slice(5)
  }
  let bottomBorder = '-'.repeat(columns)
  if (scrollTop + contentHeight < dataLength) {
    const linesBelow = `${dataLength - contentHeight - scrollTop}`
    bottomBorder = bottomBorder.slice(0,1) +
      (figures.arrowDown + linesBelow).padStart(4, '-') +
      bottomBorder.slice(5)
  }

  return (
    <Box flexDirection="column">
      <Box textWrap="truncate">{topBorder}</Box>
      {
        render({
          height: contentHeight,
          scrollTop,
          cursorIndex
        })
      }
      {paddingRows}
      <Box textWrap="truncate">{bottomBorder}</Box>
    </Box>
  )
}

function ScrollKeys ({ height, stdin, setRawMode, updateCursorAndScroll }) {
  useEffect(() => {
    setRawMode(true)
    stdin.on('data', handler)
    return () => stdin.removeListener('data', handler)

    function handler (data) {
      if (data === '\u001b[A') {
        updateCursorAndScroll(-1)
      }
      if (data === '\u001b[B') {
        updateCursorAndScroll(+1)
      }
      /*
      if (data === '\u001b[D') {
        data = 'left'
      }
      if (data === '\u001b[C') {
        data = 'right'
      }
      if (data === '\r') {
        data = 'return'
      }
      */
    }
  }, [updateCursorAndScroll])

  return null
}

export default function ScrollableWithStdin ({ height, render, dataLength }) {
  const [cursorScrollHandler, setCursorScrollHandler] = useState()
  return (
    <>
      <Scrollable
        height={height}
        render={render}
        dataLength={dataLength}
        onCursorScrollHandler={setCursorScrollHandler} />
      <StdinContext.Consumer>
        {
          ({stdin, setRawMode}) => (
            <ScrollKeys
              stdin={stdin}
              setRawMode={setRawMode}
              updateCursorAndScroll={
                cursorScrollHandler ? cursorScrollHandler.setCursorAndScroll :
                  () => {}
              } />
          )
        }
      </StdinContext.Consumer>
    </>
  )
}

