import { isFinishedGift, User } from './types'

export const getGiftOrder = (hgift: string[]) => (gift) => {
	if (isFinishedGift(hgift)(gift)) {
		return 0
	}
	return 1
}
