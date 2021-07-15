// 1 Import the PrismaClient constructor from the @prisma/client node module

const { PrismaClient } = require("@prisma/client")

// 2 Instantiate PrismaClient.

const prisma = new PrismaClient()

//3 Define an async function called main to send queries to the database.

async function main() {
  const allLinks = await prisma.link.findMany()
  console.log(allLinks)
}

//4 Call the main function.

main()
  .catch(e => {
    throw e
  })
  // 5 Close database connections when the script terminates.
  .finally(async () => {
    await prisma.$disconnect()
  })