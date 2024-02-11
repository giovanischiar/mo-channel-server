import { ArgumentsChecker } from './arguments-checker.js'
import { FileServer } from './file-server.js'
import { TVShowsServer } from './tv-shows-server.js'

function messenger(content) {
	console.log(content.join("\n"))
}

export function main(argv) {
	let argumentsChecker = new ArgumentsChecker(argv)
	argumentsChecker.checkParams(() => {
			if (argumentsChecker.isArgumentsValid) {
				let { port, fileServerPort, root } = argumentsChecker.params
				new FileServer(fileServerPort, root, messenger).start()
				new TVShowsServer(port, fileServerPort, root, messenger).start()
			} else {
				messenger(argumentsChecker.errorContent)
			}
		}
	)
}