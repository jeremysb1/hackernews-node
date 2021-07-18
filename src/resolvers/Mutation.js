const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function signup(parent, args, context, info) {
  // encrypt the User’s password using the bcryptjs library
  const password = await bcrypt.hash(args.password, 10)

  // use PrismaClient instance to store the new User record in the database
  const user = await context.prisma.user.create({ data: { ...args, password } })

  // generating a JSON Web Token
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  // return the token and the user in an object that adheres to the shape of an AuthPayload object
  return {
  	token,
  	user,
  }
}

async function login(parent, args, context, info) {
  // using PrismaClient instance to retrieve an existing User record by email
  const user = await context.prisma.user.findUnique({ where: { email: args.email } })
  if (!user) {
  	throw new Error('No such user found')
  }

  // compare the provided password with the one that is stored in the database
  const valid = await bcrypt.compare(args.password, user.password)
  	if(!valid) {
  	  throw new Error('Invalid Password')
  	}

  return {
  	token,
  	user,
  }
}

async function post(parent, args, context, info) {
  const { userId } = context;

  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    }
  })
}

module.exports = {
  signup,
  login,
  post,
}