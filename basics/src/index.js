import { GraphQLServer } from 'graphql-yoga';

// type definitions (schema)
const typeDefs = `
	type Query {
		hello: String!
		name: String!
		age: Int!
		id: ID!
		male: Boolean!
		gpa: Float
		}
`;

// resolvers
const resolvers = {
	Query: {
		hello() {
			return 'hello nathan'
		},
		name() {
			return 'Doge'
		},
		age() {
			return 48
		},
		male() {
			return true
		},
		id() {
			return 'Abc123'
		},
		gpa() {
			return null
		}
	}
};

const server = new GraphQLServer({
	typeDefs: typeDefs,
	resolvers: resolvers
});

server.start(() => {
	console.log('the server is running');
});
