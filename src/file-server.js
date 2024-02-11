import { spawn } from 'child_process'

export class FileServer {
	constructor(port, root, messenger) {
		this.port = port
		this.root = root
		this.messenger = messenger
	}

	start = () => {
		const fileServer = spawn(
			"node_modules/http-server/bin/http-server", 
			[this.root, "--no-dotfiles", "--port", this.port]
		)

		fileServer.stdout.on("data", data => {
		 	this.messenger([
		 		`+-------------------------+`,
		 		`| HTTP File Server stdout |`,
		 		`+-------------------------+`,
		 		`${data}`
		 	])
		});

		fileServer.stderr.on("data", data => {
		 	this.messenger([
		 		`+-------------------------+`,
		 		`| HTTP File Server stderr |`,
		 		`+-------------------------+`,
		 		`${data}`
		 	])
		});

		fileServer.on('error', (error) => {
		 	this.messenger([
		 		`+-------------------------+`,
		 		`| HTTP File Server error  |`,
		 		`+-------------------------+`,
		 		`${error}`
		 	])
		});

		fileServer.on("close", code => {
			this.messenger([
		 		`+-------------------------+`,
		 		`| HTTP File Server close  |`,
		 		`+-------------------------+`,
		 		`child process exited with code ${code}`
		 	])
		});
	}
}