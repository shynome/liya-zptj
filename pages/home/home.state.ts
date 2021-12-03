import { useEffect, useReducer } from 'react'
import { createContainer } from 'unstated-next'
import XLSX from 'xlsx'
import { DataStore } from './types'

type State = {
  data: DataStore
  srcSheet: XLSX.WorkSheet
  srcData: ArrayBuffer
  srcName: string
  parsing: boolean
  err: Error
}

function HomeStateReducer(s: State, ns: Partial<State>): State {
  if (!!ns.err) {
    console.error(ns.err)
  } else {
    ns.err = null
  }
  return { ...s, ...ns }
}

const initHomeState: State = {
  data: null,
  srcSheet: null,
  srcData: null,
  srcName: '',
  parsing: false,
  err: null,
}

const useHomeState = () => {
  const [state, dispatch] = useReducer(HomeStateReducer, initHomeState)
  useEffect(() => {}, [state.data])
  return { state, dispatch }
}

export const HomeState = createContainer(useHomeState)
