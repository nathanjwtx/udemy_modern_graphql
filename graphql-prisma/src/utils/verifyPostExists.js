const verifyPostExists = async (prisma, postId, userId) => {
	const postExists = await prisma.exists.Post({
		id: postId,
		author: {
			id: userId
		}
	})

	if (!postExists) {
		throw new Error('Unable to find post')
	}

	return true
}

export { verifyPostExists }
