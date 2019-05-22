import path from 'path'
import React, { useState, useEffect, useContext } from 'react'
import produce from 'immer'
import GroupContext from './groupContext'

const DealRequestsContext = React.createContext()

export function WatchDealRequests ({ children }) {
  const group = useContext(GroupContext)
  const [dealRequests, setDealRequests] = useState({})

  useEffect(() => {
    if (!group) return
    let unmounted = false
    async function run () {
      const { shared } = await group.dealRequests()
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
          Object.keys(values).forEach(key => {
            draft.dealRequests[key] = JSON.parse([...values[key].dealRequest][0])
          })
        })
        /*
        if (Object.keys(nextState).length > 0) {
          console.log('Jim loaded', nextState)
          process.exit()
        }
        */
        setDealRequests({
          shared,
          values: nextState.dealRequests
        })
      }
    }
    run()
    return () => { umounted = true }
  }, [group])

  return (
    <DealRequestsContext.Provider value={dealRequests}>
      {children}
    </DealRequestsContext.Provider>
  )
}

export default DealRequestsContext

