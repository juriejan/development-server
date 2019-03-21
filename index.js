
const fs = require('fs')
const https = require('https')

const koaLivereload = require('koa-livereload')
const koaSend = require('koa-send')
const livereload = require('livereload')

const Koa = require('koa')

class Server {

	constructor(log, root, paths) {
		this.log = log
		this.port = 3000
		this.root = root
		this.paths = paths
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
			path = this.paths.includes(initial) ? path : '/index.html'
	    // path = (path === '/' ? '/index.html' : path)
	    await koaSend(context, path, {root: this.root})
	  })
	  // Start the server
	  this.appServer = https.createServer({
			key: fs.readFileSync('localhost.key'),
			cert: fs.readFileSync('localhost.crt')
		}, app.callback())
		this.appServer.listen(this.port)
	  // Setup and start livereload server
	  this.livereloadServer = livereload.createServer({
			https: {
				key: fs.readFileSync('localhost.key'),
				cert: fs.readFileSync('localhost.crt')
			}
		})
	  this.livereloadServer.watch(this.root)
	  // Log success
	  this.log.info(`Server listening at https://localhost:${this.port}`)
	}

	close() {
		this.appServer.close()
		this.livereloadServer.close()
	}

}


module.exports = Server
