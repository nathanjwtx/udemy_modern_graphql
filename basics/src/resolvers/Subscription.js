/* eslint-disable no-unused-vars */
const Subscription = {
	count: {
		subscribe(parent, args, { pubsub }, info) {
			let count = 0

			setInterval(() => {
				count++
				pubsub.publish('count', {
					count: count
				})
			}, 1000)
			return pubsub.asyncIterator('count')
		}
	},
	comment: {
		subscribe(parent, { postId }, { db, pubsub }, info) {
			const post = db.posts.find((post) => post.id === postId && post.published)

			if (!post) {
				throw new Error('Comment subscription: comment not found')
			}

			return pubsub.asyncIterator(`comment ${postId}`)
		}
	}
}

export { Subscription }
