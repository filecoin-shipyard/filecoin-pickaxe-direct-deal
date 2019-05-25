import path from 'path'
import React, { useState, useEffect, useContext } from 'react'
import produce from 'immer'
import MineshaftContext from '@jimpick/filecoin-pickaxe-mineshaft-context'

const DealRequestsContext = React.createContext()

export function WatchDealRequests ({ children }) {
  const mineshaft = useContext(MineshaftContext)
  const [dealRequests, setDealRequests] = useState({})
  const [minerDealRequests, setMinerDealRequests] = useState({})

  useEffect(() => {
    if (!mineshaft) return
    let unmounted = false

    async function runDealRequests () {
      const { shared } = await mineshaft.dealRequests()
      loadDealRequests()
      shared.on('state changed', loadDealRequests)
      function loadDealRequests () {
        if (unmounted) {
          shared.removeListener('state changed', loadDealRequests)
          return
        }
        const nextState = produce(dealRequests, draft => {
          draft.dealRequests = {}
          const values = shared.value()
          /*
          console.log('Jim dealRequests', values)
          process.exit()
          */
          Object.keys(values).forEach(key => {
            const props = values[key]
            draft.dealRequests[key] = {}
            Object.keys(props).forEach(propName => {
              draft.dealRequests[key][propName] = JSON.parse(
                [...props[propName]][0]
              )
            })
          })
        })
        /*
        console.log('Jim dealRequests', nextState.dealRequests)
        process.exit()
        */
        setDealRequests({
          shared,
          values: nextState.dealRequests
        })
      }
    }
    runDealRequests()

    async function runMinerDealRequests () {
      const { shared } = await mineshaft.minerDealRequests()
      loadMinerDealRequests()
      shared.on('state changed', loadMinerDealRequests)
      function loadMinerDealRequests () {
        if (unmounted) {
          shared.removeListener('state changed', loadMinerDealRequests)
          return
        }
        const nextState = produce(minerDealRequests, draft => {
          draft.minerDealRequests = {}
          const values = shared.value()
          /*
          console.log('Jim minerDealRequests', values)
          process.exit()
          */
          Object.keys(values).forEach(key => {
            const value = values[key]
            if (value instanceof Set) {
              draft.minerDealRequests[key] = [...value][0]
            }
          })
        })
        setMinerDealRequests({
          shared,
          values: nextState.minerDealRequests
        })
      }
    }
    runMinerDealRequests()

    return () => { umounted = true }
  }, [mineshaft])

  const value = {
    dealRequests,
    minerDealRequests
  }

  return (
    <DealRequestsContext.Provider value={value}>
      {children}
    </DealRequestsContext.Provider>
  )
}

export default DealRequestsContext

