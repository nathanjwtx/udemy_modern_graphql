import jwt from 'jsonwebtoken'

const getUserId = (request, requireAuth = true) => {
	const header = request.request.headers.authorization

	if (header) {
		const token = header.replace('Bearer ', '')
		const decoded = jwt.verify(token, 'wibble123')

		// userid is the name set when signing the token
		return decoded.userid
	}

	if (requireAuth) {
		throw new Error('Authentication required')
	}

	return null
}

export { getUserId }
