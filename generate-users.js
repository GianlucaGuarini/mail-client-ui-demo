const { writeFileSync } = require('fs')
const faker = require('faker')
const { MAX_ITEMS_AMOUNT } = require('./constants')

const items = Array.from(
  { length: MAX_ITEMS_AMOUNT },
  (_, index) => ({
    username: faker.internet.userName(),
    avatar: faker.image.avatar(),
    title: faker.lorem.text(),
    text: faker.lorem.paragraphs(),
    id: index
  })
)

writeFileSync('users.json', JSON.stringify(items), 'utf-8')