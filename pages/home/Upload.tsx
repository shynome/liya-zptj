import { useEffect, useRef, useState } from 'react'
import XLSX from 'xlsx'
import { HomeState } from './home.state'
import { DataStore, parseItem, User } from './types'

const LimitFileTypes = ['.xlsx']

export const Upload = () => {
  const { state, dispatch } = HomeState.useContainer()
  const inputElem = useRef<HTMLInputElement>()
  useEffect(() => {
    if (!inputElem.current) {
      return
    }
    inputElem.current.onchange = (e) => {
      // @ts-ignore
      const files = e.target.files
      const f = files[0]
      if (!f) {
        return
      }
      dispatch({ parsing: true, srcName: f.name })
      let reader = new FileReader()
      reader.onload = (e) => {
        let d = e.target.result
        dispatch({ parsing: true })
        let w = XLSX.read(d, { type: 'array' })
        if (w.SheetNames.length === 0) {
          dispatch({ err: new Error('没有可用的数据') })
          return
        }
        for (let sheet of w.SheetNames) {
          dispatch({ srcSheet: w.Sheets[sheet], srcData: d as ArrayBuffer })
          break
        }
      }
      reader.onerror = (e) => {
        dispatch({ err: new Error('读取文件失败') })
      }
      reader.readAsArrayBuffer(f)
    }
  }, [inputElem.current])
  return (
    <div>
      <div>
        <label htmlFor="xlsx-file">
          {state.data ? '上传新文件' : '上传文件'}
        </label>
        <input
          id="xlsx-file"
          type="file"
          ref={inputElem}
          accept={LimitFileTypes.join(', ')}
          disabled={state.parsing}
        />
      </div>
      {state.parsing && <div>{state.srcName} 解析中...</div>}
      <ParseXLSX />
    </div>
  )
}

export const ParseXLSX = () => {
  const { state, dispatch } = HomeState.useContainer()
  useEffect(() => {
    if (!state.srcSheet) {
      return
    }
    try {
      let store: DataStore = {}
      let giftKinds: { [gift: string]: 1 } = {}
      for (let poi in state.srcSheet) {
        if (poi.startsWith('!')) {
          continue
        }
        let v = parseItem(state.srcSheet[poi].v)
        let u = store[v.id] ?? (store[v.id] = new User(v.id))
        u.pushNickname(v.nickname)
        u.pushGift(v.gift, poi)
        giftKinds[v.gift] = 1
      }
      dispatch({ data: store, parsing: false })
      // console.log(giftKinds)
    } catch (err) {
      dispatch({ err: err })
    }
  }, [state.srcSheet])
  return <div></div>
}
