import { writable } from 'svelte/store'
import { parseItem, User } from './types'
import type { DataStore, DataStore2 } from './types'
import type XLSX from 'xlsx'

export type State = {
	table1: DataStore
	table2: DataStore2
	srcData: ArrayBuffer
	srcName: string
	err: any
	parsing: boolean
}

const initState: State = {
	table1: null,
	table2: null,
	srcData: null,
	srcName: null,
	err: null,
	parsing: false,
}

function parseData(srcSheet: XLSX.Sheet) {
	let store: DataStore = {}
	let store2: DataStore2 = {}
	for (let poi in srcSheet) {
		if (poi.startsWith('!')) {
			continue
		}
		let v = parseItem(srcSheet[poi].v)
		{
			// data
			let u = store[v.id] ?? (store[v.id] = new User(v.id))
			u.pushNickname(v.nickname)
			u.pushGift(v.gift, poi)
		}
		{
			// data2
			let sheet = store2[v.gift] ?? (store2[v.gift] = {})
			let u =
				sheet[v.id] ??
				(sheet[v.id] = {
					count: 0,
					gift: v.gift,
					id: v.id,
					nickname: v.nickname,
					records: [],
				})
			u.count += 1
			u.records.push(poi)
		}
	}
	return { store, store2 }
}

function createState() {
	const { subscribe, set, update } = writable(initState)
	const showError = (err) => update((a) => ({ ...a, err: err }))
	function parse(srcSheet: XLSX.Sheet, srcName: string, srcData: ArrayBuffer) {
		try {
			let { store, store2 } = parseData(srcSheet)
			set({
				table1: store,
				table2: store2,
				srcName: srcName,
				srcData: srcData,
				err: null,
				parsing: false,
			})
		} catch (err) {
			showError(err)
			update((a) => ({ ...a, parsing: false }))
		}
		// reader.readAsArrayBuffer(f)
	}
	return {
		subscribe,
		parse,
		showError,
	}
}

export const state = createState()
