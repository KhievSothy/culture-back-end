require('dotenv').config()

const dbConnect = require('./src/db/db.js')
const SiteModel = require('./src/models/site.js')
const { faker } = require('@faker-js/faker');
const UserModel = require('./src/models/user.js');
const EventModel = require('./src/models/event.js');

dbConnect().catch((err) => {
    console.log(err)
})

const numberOfSites = 20
const numberOfUsers = 20
const numberOfEvents = 20

console.log(Date.now())

async function generate() {
    for (let i = 0; i < numberOfSites; i++) {
        const newSite = new SiteModel({
            title: faker.lorem.sentence({ min: 3, max: 5 }),
            category: faker.lorem.sentence({ min: 1, max: 3 }),
            description: faker.lorem.paragraph(),
        })
        const result = await newSite.save()
        console.log(`${i} - Site with id: ${result._id} generated`)
    }

    let usersList = []

    for (let i = 0; i < numberOfUsers; i++) {
        const newUser = new UserModel({
            username: faker.internet.userName(),
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),
            dateOfBirth: faker.date.birthdate(),
            email: faker.internet.email()
        })
        const result = await newUser.save()
        usersList.push(result._id)
        console.log(`${i} - User with id: ${result._id} generated`)
    }

    for (let i = 0; i < numberOfEvents; i++) {
        const randomId = usersList[Math.floor(Math.random() * usersList.length)]
        const newEvent = new EventModel({
            title: faker.lorem.sentence({ min: 3, max: 5 }),
            category: faker.lorem.sentence({ min: 1, max: 3 }),
            description: faker.lorem.paragraph(),
            
        })
        const result = await newEvent.save()
        console.log(`${i} - Event with id: ${result._id} generated`)
    }
}
generate()