/* eslint-disable no-unused-vars */

import { getUserId } from '../utils/getUserId'

const User = {
	email: {
		fragment: 'fragment userId on User { id }',
		resolve(parent, args, {request}, info) {
			const userId = getUserId(request, false)

			// id needs to be part of the request for this to work
			if (userId && userId === parent.id) {
				return parent.email
			} else {
				return null
			}
		}
	},
	posts: {
		fragment: 'fragment userId on User { id }',
		resolve(parent, args, {prisma}, info) {

			return prisma.query.posts({
				where: {
					published: true,
					author: {
						id: parent.id
					}
				}
			})
		}
	}
}

export { User }
