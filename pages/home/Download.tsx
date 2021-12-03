import { useEffect, useMemo, useRef, useState, Fragment } from 'react'
import { HomeState } from './home.state'
import { isFinishedGift, User } from './types'
import XLSX from 'xlsx'
import styles from './Download.module.css'

export const Download = () => {
  const { state, dispatch } = HomeState.useContainer()
  const csv = useMemo(() => {
    if (!state.data) {
      return null
    }
    let d: User[] = []
    for (let k in state.data) {
      d.push(state.data[k])
    }
    d.sort((a, b) => {
      return a.needSendGiftsCount > b.needSendGiftsCount ? -1 : 1
    })
    // let csv = d.map((user) => {
    //   let sortedFields = Object.keys(user.gifts)
    //     // 按字符排序一次
    //     .sort()
    //     .sort((a, b) => {
    //       return getGiftOrder(a) > getGiftOrder(b) ? -1 : 1
    //     })
    //   return {
    //     nickname: user.nicknames.join('\r\n'),
    //     id: user.id,
    //     gift: sortedFields
    //       .map((r) => {
    //         let g = user.gifts[r]
    //         return `${r} x${g.count}`
    //       })
    //       .join('\r\n'),
    //     records: sortedFields
    //       .map((r) => {
    //         let g = user.gifts[r]
    //         return `${g.pois.join(' ')}`
    //       })
    //       .join('\r\n'),
    //   }
    // })
    return d
  }, [state.data])
  const table = useRef<HTMLTableElement>()
  const download = () => {
    const wb = XLSX.utils.book_new()
    let ws = XLSX.utils.table_to_sheet(table.current)
    ws['!cols'] = [
      { wch: 20 },
      { wch: 10 },
      { wch: 25 },
      { wch: 6 },
      { wch: 6 },
      { wch: 6 },
      { wch: 150 },
    ]
    XLSX.utils.book_append_sheet(wb, ws, '统计结果')
    const old = XLSX.read(state.srcData)
    let ows = old.Sheets[old.SheetNames[0]]
    XLSX.utils.book_append_sheet(wb, ows, '元数据')
    XLSX.writeFile(wb, state.srcName.replace('.xlsx', '-统计结果.xlsx'))
  }
  if (!csv) {
    return <div>暂无统计文件可下载</div>
  }
  return (
    <div>
      <button onClick={download}>点击下载统计数据文件</button>
      <hr />
      <table ref={table} className={styles.table}>
        <thead>
          <tr>
            <td>呢称(含曾用)</td>
            <td>用户id(唯一凭证)</td>
            <td>中奖礼物</td>
            <td>数量</td>
            <td>分割(0)</td>
            <td>待处理</td>
            <td>中奖记录(对应行)</td>
          </tr>
        </thead>
        <tbody>
          {csv.map((u) => {
            let sortedFields = Object.keys(u.gifts)
              // 按字符排序一次
              .sort()
              .sort((a, b) => {
                return getGiftOrder(a) > getGiftOrder(b) ? -1 : 1
              })
            return (
              <Fragment key={u.id}>
                <tr className={styles.f}>
                  <td colSpan={7}></td>
                </tr>
                {sortedFields.map((gift, i) => {
                  return (
                    <tr key={gift}>
                      {i === 0 && (
                        <Fragment>
                          <td rowSpan={sortedFields.length}>
                            {u.nicknames[0]}
                          </td>
                          <td rowSpan={sortedFields.length}>{u.id}</td>
                        </Fragment>
                      )}
                      <td>
                        <pre>{gift}</pre>
                      </td>
                      <td>{u.gifts[gift].count}</td>
                      <td></td>
                      {i === 0 && (
                        <td rowSpan={sortedFields.length}>
                          {u.needSendGiftsCount}
                        </td>
                      )}
                      <td>{u.gifts[gift].pois.join(',')}</td>
                    </tr>
                  )
                })}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const getGiftOrder = (gift) => {
  if (isFinishedGift(gift)) {
    return 0
  }
  return 1
}
