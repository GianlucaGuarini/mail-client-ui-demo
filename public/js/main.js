const $ = document.querySelector.bind(document)
const win = window
const loc = win.location
const [button, list] = [$('button'), $('ul')]
const MAX_PAGES = 10

const onLoadMore = async() => {
  const currentQuery = new URLSearchParams(loc.search)
  const currentPage = Number(currentQuery.get('page')) || 1

  if (currentPage === MAX_PAGES - 1) button.parentNode.removeChild(button)

  const template = document.createElement('template')
  const nextPage = currentPage + 1
  const oldScroll = win.scrollY
  const newItems = await fetch(`/api/list?page=${nextPage}&offset=${currentPage}`).then(r => r.text())

  history.replaceState({}, null, `?page=${nextPage}`)
  template.innerHTML = newItems
  list.appendChild(template.content)
  win.scrollTo({ top: oldScroll, left: 0})
}

button.addEventListener('click', onLoadMore)