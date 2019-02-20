
const koaLivereload = require('koa-livereload')
const koaSend = require('koa-send')
const livereload = require('livereload')

const Koa = require('koa')

const PATHS = ['components', 'data', 'fonts', 'styles']

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
	  app.use(async (context) => {
	    let path = context.path
			let initial = path.split('/').slice(1)[0]
			path = PATHS.includes(initial) ? path : '/index.html'
	    // path = (path === '/' ? '/index.html' : path)
	    await koaSend(context, path, {root: this.root})
	  })
	  // Start the server
	  this.appServer = app.listen(this.port)
	  // Setup and start livereload server
	  this.livereloadServer = livereload.createServer()
	  this.livereloadServer.watch(this.root)
	  // Log success
	  this.log.info(`Server listening at localhost:${this.port}`)
	}

	close() {
		this.appServer.close()
		this.livereloadServer.close()
	}

}


module.exports = Server
