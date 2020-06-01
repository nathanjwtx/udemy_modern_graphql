import jwt from 'jsonwebtoken'

const getUserId = (request) => {
	const header = request.request.headers.authorization

	if (!header) {
		throw new Error('Authentication failed')
	}

	const token = header.replace('Bearer ', '')
	const decoded = jwt.verify(token, 'wibble123')

	// userid is the name set when signing the token
	return decoded.userid
}

export { getUserId }
