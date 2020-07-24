const faker = require('faker')
const curry = require('curri')

const PAGE_QUERY_PARAM = 'page'
const OFFSET_QUERY_PARAM = 'offset'
const MAX_PAGES = 10
const AMOUNT_ITEMS_BY_PAGE = 100
const MAX_ITEMS_AMOUNT = MAX_PAGES * AMOUNT_ITEMS_BY_PAGE

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

const getItemById = id => items.find(item => item.id === id)
const getItems = (start, end) => items.slice(start, end)
const getIntQueryParam = (name, ctx) => Number(ctx.request.query[name])
const getItemsByPage = ({offset, page}) => getItems(
  normalizeOffset(offset) * AMOUNT_ITEMS_BY_PAGE,
  normalizePage(page) * AMOUNT_ITEMS_BY_PAGE
)
const getPageById = id => Math.floor(id / AMOUNT_ITEMS_BY_PAGE) + 1
const isValidInt = num => Number.isInteger(num)
const isPaginationValueInRange = value => value > 0 && value <= MAX_PAGES
const normalizeOffset = offset =>
  isValidInt(offset) && isPaginationValueInRange(offset) ? offset : 0
const normalizePage = page =>
  isValidInt(page) && isPaginationValueInRange(page) ? page : 1


exports.getPageParam = curry(getIntQueryParam)(PAGE_QUERY_PARAM)
exports.getOffsetParam = curry(getIntQueryParam)(OFFSET_QUERY_PARAM)
exports.getItemById = getItemById
exports.getPageById = getPageById
exports.getItemsByPage = getItemsByPage