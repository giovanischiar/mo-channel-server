import { spawn } from 'child_process'
import { createServer } from 'http-server'

export class FileServer {
	constructor(port, root, messenger) {
		this.port = port
		this.root = root
		this.messenger = messenger
	}

	start = () => {
		let server = createServer({root: this.root, showDotfiles: false})
		server.listen(this.port, () => {
			let i = 0
			let horizontalFrame = ""
			while (i++ < this.port.toString().length) { horizontalFrame += "-"}
		 	this.messenger([
		 		`+---------------------------------${horizontalFrame}-+`,
		 		`| HTTP File Server created. Port: ${this.port} |`,
		 		`+---------------------------------${horizontalFrame}-+`,
		 	])
			}
		)
	}
}