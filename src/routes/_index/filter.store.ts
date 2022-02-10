import { writable } from 'svelte/store'

const StoreKey = 'liya-zp-filter-gift-list'

function createFilterStore() {
	let _v = []
	const { subscribe, set } = writable(_v, (set) => {
		let s = localStorage.getItem(StoreKey)
		if (!s) {
			return
		}
		try {
			let v = JSON.parse(s)
			if (Array.isArray(v)) {
				_v = v
				set(v)
			}
		} catch (err) {}
	})
	const _set: typeof set = (value) => {
		_v = value
		localStorage.setItem(StoreKey, JSON.stringify(value))
		return set(value)
	}

	return {
		subscribe,
		set: _set,
	}
}

export const fstore = createFilterStore()
