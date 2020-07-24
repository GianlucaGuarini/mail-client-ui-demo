const Koa = require('koa')
const Router = require('koa-router')
const koaStatic = require('koa-static')
const nunjucks = require('nunjucks')
const {join} = require('path')
const views = require('koa-views')
const {
  getItemsByPage,
  getPageParam,
  getOffsetParam,
  getItemById,
  getPageById
} = require('./utils')

// config
const port = 3000
const viewsFolder = join(__dirname, 'views')
const assetsFolder = join(__dirname, 'assets')

// app instances
const app = new Koa()
const router = new Router()
const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(viewsFolder)
)

const render = views(viewsFolder, {
  map: {
    html: 'nunjucks'
  },
  options: {
    nunjucksEnv: env
  }
})

router
  .get('/', async ctx => {
    await ctx.render('home', {
      items: getItemsByPage({
        page: getPageParam(ctx)
      })
    })
  })
  .get('/api/list', async ctx => {
    await ctx.render('_list', {
      items: getItemsByPage({
        page: getPageParam(ctx),
        offset: getOffsetParam(ctx)
      })
    })
  })
  .get('/detail/:id', async ctx => {
    const id = Number(ctx.params.id)
    const item = getItemById(Number(ctx.params.id))

    if (item) {
      await ctx.render('detail', {
        item,
        page: getPageById(id)
      })
    } else {
      ctx.status = 404
      await ctx.render('not-found', {
        message: 'Item not found :('
      })
    }
  })
  .get(/(|^$)/, async ctx => {
    ctx.status = 404
    await ctx.render('not-found', {
      message: 'Site not found'
    })
  })

app
  .use(render)
  .use(koaStatic(assetsFolder))
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(port)
console.log(`App running on: http://localhost:${port}`)