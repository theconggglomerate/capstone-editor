'use strict'

const {User, Notes, noteNotes} = require('../server/db/models')
const {db} = require('../server/db')
const faker = require('faker')
const Axios = require('axios')

async function seed() {
  await db.sync({
    force: true
  })
  console.log('db synced!')

  const users = await Promise.all([
    User.create({
      email: 'cody@email.com',
      password: '123'
    }),
    User.create({
      email: 'murphy@email.com',
      password: '123'
    })
  ])

  let sampleFaker = []

  function generateMD() {
    const fileContents = `
    ${faker.company.catchPhrase()} \n
    ${faker.company.catchPhrase()} \n
    ${faker.company.catchPhrase()}
    ${faker.lorem.paragraph()}
    `
    return fileContents
  }

  const snippets = require('./snippets.json')
  const seedNotes = []

  const wordList = [
    'Databases',
    'Queries',
    'JavaScript',
    'GraphQL',
    'Node.js',
    'Express',
    'Git Workflow',
    'Algorithms & Analysis',
    'Time Complexity',
    'Event Loop',
    'SQL',
    'Sequelize',
    'Async/Await',
    'Try/Catch Blocks',
    'REST',
    'App Main Page Requirements',
    'Eager Loading',
    'Postico',
    'Postgres',
    'd3',
    'React',
    'Redux',
    'Redux-Persist',
    'Reducers',
    'Testing with Mocha',
    'Web Sockets',
    'Incomplete Workshops',
    'React Router',
    'Checkpoints',
    'Promises',
    'Node Shell'
  ]

  faker.random.number({min: 0, max: 10})

  async function generator() {
    for (let i = 0; i < 20; i++) {
      const title = wordList[i]
      const cells = []
      seedNotes.push({title, content: {cells}, user: 1})
    }
  }

  generator()

  const seedData = seedNotes

  const notes = await Notes.bulkCreate(seedData, {
    returning: true
  })

  // const noteNoteData = require('./noteNoteData.json')

  // const filterFunc = function(dataArr) {
  //   let tracker = {}
  //   let returnArr = []
  //   for (let i in dataArr) {
  //     if (dataArr[i].sourceId === dataArr[i].targetId) continue
  //     else if (!tracker[dataArr[i].sourceId]) {
  //       tracker[dataArr[i].sourceId] = [dataArr[i].targetId]
  //     } else if (tracker[dataArr[i].sourceId].includes(dataArr[i].targetId)) {
  //       continue
  //     } else {
  //       tracker[dataArr[i].sourceId].push(dataArr[i].targetId)
  //       returnArr.push(dataArr[i])
  //     }
  //   }
  //   return returnArr
  // }

  // const associations = await noteNotes.bulkCreate(filterFunc(noteNoteData))

  // console.log(`seeded ${associations.length} associations between notes`)
  console.log(`seeded ${notes.length} notes`)
  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
