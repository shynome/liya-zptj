export class User {
	id: string
	nicknames: string[] = []
	gifts: {
		[name: string]: {
			count: number
			/**中奖记录定位  */
			pois: string[]
		}
	} = {}
	/**@deprecated */
	needSendGiftsCount: number = 0
	getNeedSendGiftsCount = (hgift: string[]) => {
		let count = 0
		for (let k in this.gifts) {
			if (isFinishedGift(hgift)(k)) {
				continue
			}
			count += this.gifts[k].count
		}
		return count
	}
	constructor(id: string) {
		this.id = id
	}
	pushNickname(name: string) {
		for (let n of this.nicknames) {
			if (n === name) {
				return
			}
		}
		this.nicknames.push(name)
	}
	pushGift(gift: string, poi: string) {
		let sameGifts = this.gifts[gift] ?? (this.gifts[gift] = { count: 0, pois: [] })
		sameGifts.count += 1
		sameGifts.pois.push(poi)
		// if (!isFinishedGift(gift)) {
		if (true) {
			this.needSendGiftsCount += 1
		}
	}
}

/**是否是直播间已经完成了的礼物 */
export const isFinishedGift = (hgift: string[]) => (gift: string) => {
	return hgift.includes(gift)
}

const testStr = '[2021/11/29 15:02:45] 兔兔真好吃多放辣(4827110) 抽中 莉娅喵喵叫5声'
export type Item = {
	id: string
	nickname: string
	gift: string
}
export function parseItem(str: string): Item {
	const itemRex = /^\[.+\] (\S+)\((\d+)\) 抽中 (\S+)$/
	let x = str.match(itemRex)
	let [nickname, id, gift] = x.slice(1)
	return { id, nickname, gift }
}

export type DataStore = { [k: string]: User }

export type Item2 = {
	id: string
	nickname: string
	gift: string
	count: number
	records: string[]
}
export type DataStore2 = { [k: string]: { [id: string]: Item2 } }
