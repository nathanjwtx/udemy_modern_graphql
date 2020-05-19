import {GraphQLServer} from 'graphql-yoga'

import { db } from './db'
import { Query } from './resolvers/Query'
import { Mutation} from './resolvers/Mutations'
import { Comment} from './resolvers/Comment'
import { Post} from './resolvers/Post'
import { User } from './resolvers/User'

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers: {
		Query,
		Mutation,
		Comment,
		Post,
		User
	},
	context: {
		db
	}
})

server.start(() => {
	console.log('the server is running')
})
