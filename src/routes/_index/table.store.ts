import { derived } from 'svelte/store'
import { state } from './state'
import { fstore } from './filter.store'
import { getGiftOrder } from './table'
import type { User } from './types'
import { isFinishedGift } from './types'

export const tabs = derived([state, fstore], ([state, fstore]) => {
	const tabs = Object.keys(state.table2) // 按字符排序一次
		.sort()
		.sort((a, b) => {
			return getGiftOrder(fstore)(a) > getGiftOrder(fstore)(b) ? -1 : 1
		})
	return tabs
})

const dcsvGen = (hiddenFinishedGift = false) => {
	return derived([state, fstore], ([state, fstore]) => {
		let csv: User[] = Object.keys(state.table1)
			.map((k) => state.table1[k])
			.sort((a, b) => {
				return a.getNeedSendGiftsCount(fstore) > b.getNeedSendGiftsCount(fstore) ? -1 : 1
			})
		let dcsv = csv
			.map((u) => {
				let sortedFields = Object.keys(u.gifts)
					.filter((g) => {
						if (hiddenFinishedGift) {
							return !isFinishedGift(fstore)(g)
						}
						return true
					})
					// 按字符排序一次
					.sort()
					.sort((a, b) => {
						return getGiftOrder(fstore)(a) > getGiftOrder(fstore)(b) ? -1 : 1
					})
				return {
					u,
					sortedFields,
				}
			})
			.filter(({ sortedFields }) => {
				return sortedFields.length > 0
			})
		return dcsv
	})
}

export const dcsv = dcsvGen()
export const dcsv2 = dcsvGen(true)
