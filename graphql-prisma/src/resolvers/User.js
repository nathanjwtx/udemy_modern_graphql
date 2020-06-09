/* eslint-disable no-unused-vars */

import { getUserId } from '../utils/getUserId'

const User = {
	email(parent, args, { request }, info) {
		const userId = getUserId(request, false)

		// id needs to be part of the request for this to work
		if (userId && userId === parent.id) {
			return parent.email
		} else {
			return null
		}
	}
}

export { User }
