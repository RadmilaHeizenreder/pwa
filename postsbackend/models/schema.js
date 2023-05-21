const graphql = require('graphql')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLString, GraphQLSchema, GraphQLList } = graphql;

const Posts = require('./posts'); //movie
const Users = require('./user'); //director

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLID},
        email: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
        /* posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                // return posts.filter(post => post.user === parent.id);
                return Posts.find({userId: parent.id})
            }
        } */
    })
})

const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: new GraphQLNonNull(GraphQLString) },
        location: { type: new GraphQLNonNull(GraphQLString) },
        image_id: { type: new GraphQLNonNull(GraphQLString) },
        userId: { 
            type: UserType,
            resolve(parent, args) {
                // return users.find(user => userId.id === parent.id)
                return Users.findById(parent.userId)
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addPost: {
            type: PostType,
            args: {
                title: {type: new GraphQLNonNull(GraphQLString)},
                location: {type: new GraphQLNonNull(GraphQLString)},
                image_id: {type: new GraphQLNonNull(GraphQLString) },
                userId: { type: GraphQLID }
            },
            resolve(parent, args) {
                const post = new Posts({
                    title: args.title,
                    location: args.location,
                    image_id: args.image_id,
                    userId: args.userId
                })
                return post.save()
            }
        },
        addUser: {
            type: UserType,
            args: {
                email: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args) {
                const salt = bcrypt.genSaltSync(10)
                const password = args.password
                const hashPassword = bcrypt.hashSync(password, salt)
                const user = new Users({
                    email: args.email,
                    password: hashPassword
                })
                return user.save()
            }
        },
        loginUser: {
            type: UserType,
            args: {
                email: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent, args) {
                const user = await Users.findOne({
                    email: args.email
                })
                if(user) {
                    //Candidate existiert bereits, dann wird password überprüft
                    const passwordResult = await bcrypt.compare(args.password, user.password)

                    if(passwordResult) {
                        //wenn password true, muss token generiert werden
                        const token = jwt.sign({
                            email: user.email,
                            userId: user._id
                        }, process.env.JWT, {expiresIn: 60*60*3})

                        console.log({
                            email: {email: user.email},
                            token: `Bearer ${token}`
                        })
                        return user;
                    } else {
                        // wenn password false
                        throw new Error('Invalid password');
                    }
                } else {
                    throw new Error('User not found');
                }
            }
        },
        deletePost: {
            type: PostType,
            args: { id: { type: GraphQLID }},
            async resolve(parent, args) {
                const post = await Posts.findById(args.id);
                return Posts.findByIdAndRemove(post)
            }
            
        }

        /* updatePost: {

        },
         */
    }
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        post: {
            type: PostType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                // return Posts.find(post => post.id === args.id);
				return Posts.findById(args.id);
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                // return posts;
                return Posts.find({})
            }
        },
        user: {
            type: UserType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                // return Users.find(user => user.id === args.id);
				return Users.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                // return users;
                return Users.find({})
            }
        }
    }
    
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
})
