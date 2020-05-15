import { GraphQLServer } from 'graphql-yoga';

// type definitions (schema)
const typeDefs = `
	type Query {
		greeting(name: String): String!
		me: User!
		add(num1: Float!, num2: Float!): Float!
		add2(numbers: [Float!]!): Float!
		grades: [Int!]!
	}
		
	type User {
		id: ID!
		name: String!
		age: Int
		email: String
	}
`;

// resolvers
const resolvers = {
	Query: {
		greeting(parent, args) {
			if (args.name) {
				return `hello, ${args.name}!`
			} else {
				return 'hello'
			}
		},
		me() {
			return {
				id: 'Abc456',
				name: 'nathan',
				age: 48,
				email: 'someone@gmail.com'
			}
		},
		add(parent, args) {
			return args.num1 + args.num2
		},
		grades(parent, args, ctx, info) {
			return [30, 40, 50]
		},
		add2(parent, args, ctx, info) {
			if (args.numbers.length === 0) {
				return 0
			} else {
				return args.numbers.reduce((accumulator, currentValue) => {
					return accumulator + currentValue
				})
			}
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
