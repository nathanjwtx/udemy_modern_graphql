import {GraphQLServer, PubSub} from 'graphql-yoga'

import { db } from './db'
import { Query } from './resolvers/Query'
import { Mutation} from './resolvers/Mutations'
import { Comment} from './resolvers/Comment'
import { Post} from './resolvers/Post'
import { User } from './resolvers/User'
import { Subscription} from './resolvers/Subscription'

import { prisma } from './prisma'

const pubsub = new PubSub()

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers: {
		Query,
		Mutation,
		Comment,
		Post,
		User,
		Subscription
	},
	context: {
		db,
		pubsub,
		prisma
	}
})

server.start(() => {
	console.log('the server is running')
})
