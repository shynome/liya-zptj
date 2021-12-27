import { isFinishedGift, User } from './types'

export const getGiftOrder = (gift) => {
	if (isFinishedGift(gift)) {
		return 0
	}
	return 1
}
