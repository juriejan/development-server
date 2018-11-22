
const koaLivereload = require('koa-livereload')
const koaSend = require('koa-send')
const livereload = require('livereload')

const Koa = require('koa')


class Server {

	constructor(log, root) {
		this.log = log
		this.port = 3000
		this.root = root
	}

	listen() {
		// Setup and start static server
	  let app = new Koa()
	  // Attach the livereload script
	  app.use(koaLivereload())
	  // Serve directories marked to pass and rewrite rest to index
	  app.use(async (ctx) => {
	    let path = ctx.path
	    path = (path === '/' ? '/index.html' : path)
	    await koaSend(ctx, path, {root: this.root})
	  })
	  // Start the server
	  app.listen(this.port)
	  // Setup and start livereload server
	  let livereloadServer = livereload.createServer()
	  livereloadServer.watch(this.root)
	  // Log success
	  this.log.info(`Server listening at localhost:${this.port}`)
	}

}


module.exports = Server
