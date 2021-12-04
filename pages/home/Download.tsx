import React, { useEffect, useMemo, useRef, useState, Fragment } from 'react'
import { HomeState } from './home.state'
import { isFinishedGift, Item2, User } from './types'
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
  const table2 = useRef<HTMLTableElement>()
  const download = () => {
    const wb = XLSX.utils.book_new()
    const widths = [
      { wch: 20 },
      { wch: 10 },
      { wch: 25 },
      { wch: 6 },
      { wch: 6 },
      { wch: 6 },
      { wch: 150 },
    ]
    let ws = XLSX.utils.table_to_sheet(table.current)
    let ws2 = XLSX.utils.table_to_sheet(table2.current)
    ws['!cols'] = widths
    ws2['!cols'] = widths
    XLSX.utils.book_append_sheet(wb, ws, '按用户')
    XLSX.utils.book_append_sheet(wb, ws2, '按用户(原)')
    const old = XLSX.read(state.srcData)
    let ows = old.Sheets[old.SheetNames[0]]
    XLSX.utils.book_append_sheet(wb, ows, '元数据')
    XLSX.writeFile(wb, state.srcName.replace('.xlsx', '-统计结果-按用户.xlsx'))
  }
  const [tab, setTab] = useState(0)
  const activeCC = (i) => (ni) => {
    return i === ni ? styles.active : ''
  }
  if (!csv) {
    return <div>暂无统计文件可下载</div>
  }
  return (
    <div>
      <dl className={styles.dlbtns}>
        <dt>下载统计数据文件:</dt>
        <dd>
          <button onClick={download}>按用户</button>
          <button onClick={() => document.getElementById('sortByGift').click()}>
            按礼物
          </button>
        </dd>
      </dl>
      <hr />
      <ol className={styles.navs}>
        <li className={styles.active}>分类:</li>
        {['用户', '礼物', '用户(原)'].map((s, i) => {
          const activeC = tab === i ? styles.active : ''
          return (
            <li key={s} onClick={() => setTab(i)} className={activeC}>
              {s}
            </li>
          )
        })}
      </ol>
      <div className={styles.tabsContent}>
        <div className={activeCC(0)(tab)}>
          <DataTable
            csv={csv.filter((t) => t.needSendGiftsCount > 0)}
            ref={table}
            hiddenFinishedGift
          />
        </div>
        <div className={activeCC(1)(tab)}>
          <GiftItemTable />
        </div>
        <div className={activeCC(2)(tab)}>
          <DataTable csv={csv} ref={table2} />
        </div>
      </div>
    </div>
  )
}

type DataTableProps = {
  csv: User[]
  hiddenFinishedGift?: boolean
}
const DataTable = React.forwardRef<HTMLTableElement, DataTableProps>(
  ({ csv, hiddenFinishedGift }, ref) => {
    return (
      <table ref={ref} className={styles.table}>
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
              .filter((g) => {
                if (hiddenFinishedGift) {
                  return !isFinishedGift(g)
                }
                return true
              })
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
    )
  },
)

const getGiftOrder = (gift) => {
  if (isFinishedGift(gift)) {
    return 0
  }
  return 1
}

const GiftItemTable = React.forwardRef<HTMLTableElement>((_props, ref) => {
  const [tab, setTab] = useState(0)
  const activeCC = (i) => (ni) => {
    return i === ni ? styles.active : ''
  }
  const { state } = HomeState.useContainer()
  let sortedFields = Object.keys(state.data2)
    // 按字符排序一次
    .sort()
    .sort((a, b) => {
      return getGiftOrder(a) > getGiftOrder(b) ? -1 : 1
    })
  const download = () => {
    const wb = XLSX.utils.book_new()
    const widths = [
      { wch: 20 },
      { wch: 10 },
      { wch: 25 },
      { wch: 6 },
      { wch: 6 },
      { wch: 6 },
      { wch: 150 },
    ]
    let tables = document.querySelectorAll('#gift-tables table')
    let i = 0
    for (let sheet of sortedFields) {
      let ws = XLSX.utils.table_to_sheet(tables[i++])
      ws['!cols'] = widths
      XLSX.utils.book_append_sheet(wb, ws, sheet)
    }
    const old = XLSX.read(state.srcData)
    let ows = old.Sheets[old.SheetNames[0]]
    XLSX.utils.book_append_sheet(wb, ows, '元数据')
    XLSX.writeFile(wb, state.srcName.replace('.xlsx', '-统计结果-按礼物.xlsx'))
  }
  return (
    <div id="gift-tables">
      <input
        id="sortByGift"
        // style={{ display: 'none' }}
        onClick={download}
        type="button"
        value="下载礼物排序数据"
      />
      <ol className={styles.navs}>
        {sortedFields.map((s, i) => {
          const activeC = tab === i ? styles.active : ''
          return (
            <li key={s} onClick={() => setTab(i)} className={activeC}>
              {s}
            </li>
          )
        })}
      </ol>
      <div className={styles.tabsContent}>
        {sortedFields.map((name, i) => {
          let items: Item2[] = []
          for (let k in state.data2[name]) {
            let u = state.data2[name][k]
            items.push(u)
          }
          items.sort((a, b) => {
            return a.count > b.count ? -1 : 1
          })
          return (
            <div className={activeCC(i)(tab)} key={name}>
              <table ref={ref} className={styles.table}>
                <thead>
                  <tr>
                    <td>呢称</td>
                    <td>用户id(唯一凭证)</td>
                    <td>礼物</td>
                    <td>数量</td>
                    <td>分割(0)</td>
                    <td>分割(0)</td>
                    <td>中奖记录(对应行)</td>
                  </tr>
                </thead>
                <tbody>
                  {items.map((t) => {
                    return (
                      <tr key={t.id}>
                        <td>{t.nickname}</td>
                        <td>{t.id}</td>
                        <td>{t.gift}</td>
                        <td>{t.count}</td>
                        <td></td>
                        <td></td>
                        <td>{t.records.join(',')}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
    </div>
  )
})
