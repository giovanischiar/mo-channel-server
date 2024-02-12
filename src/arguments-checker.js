import fs from 'fs'

export class ArgumentsChecker {
	constructor(entryArguments) {
		let fileNames = entryArguments[1].split("/")
		let fileName = fileNames[fileNames.length - 1]
		this.entryArguments = entryArguments
		this.isArgumentsValid = false
		this.usageContent = [
			`Usage: ${fileName} --config config.json`,
			"Create a file config.json",
			"{", 
			"    port          : /* Server port number e.g.: 3000 */,",
			"    fileServerPort: /* File server port number e.g.: 8080 (it can't be the same as server port) */,",
			"    root          : /* Path to tv shows directory e.g.: \"path/to/tv-shows/\"*/",
			"}"
		]
		this.errorContent = this.usageContent
	}

	checkParams = (onChecked) => {
		this.onChecked = onChecked
		if (this.entryArguments.length == 2) {
			let self = this
			let execPath = process.execPath.split("/")
			console.log(process.execPath)
			execPath.splice(-1)
			let file = execPath.join("/") + "/config.json"
			fs.readFile(file, function(err, data) { 
				if (!err) {
					self.checkFileContent(data)
					return
				} else {
					self.errorContent = [err, ...self.usageContent]
					self.onChecked()
				}
			});
			return
		}

		if (this.entryArguments.length > 4) {
			let portLabelIndex = this.entryArguments.indexOf("--port")
			let portIndex = portLabelIndex + 1
			let fileServerPortLabelIndex = this.entryArguments.indexOf("--file-server-port")
			let fileServerPortIndex = fileServerPortLabelIndex + 1
			let rootLabelIndex = this.entryArguments.indexOf("--root")
			let rootIndex = rootLabelIndex + 1
			if (
				portLabelIndex != -1 && 
				fileServerPortLabelIndex != -1 && 
				rootLabelIndex != -1 &&
				portIndex < this.entryArguments.length &&
				fileServerPortLabelIndex < process.argv.length &&
				rootLabelIndex < this.entryArguments.length
			) {
				let port =　this.entryArguments[portIndex]
				let fileServerPort = this.entryArguments[fileServerPortIndex]
				let root = this.entryArguments[rootIndex]
				if (this.checkArguments(port, fileServerPort, root)) {
					this.params = { port: port, fileServerPort: fileServerPort, root }
					this.isArgumentsValid = true
				} 
			}
			onChecked()
			return
		}

		var configLabelIndex = process.argv.indexOf("--config")
		var configIndex = configLabelIndex + 1
		if (configLabelIndex != -1 && configIndex < process.argv.length) {
			let self = this
			fs.readFile(process.argv[configIndex], function(err, data) { 
				if (!err) {
					self.checkFileContent(data)
					return
				} else {
					self.errorContent = [err, ...this.usageContent]
				}
			});
		} else {
			onChecked()
		}
	}

	checkFileContent = (contents) => {
		var json = {}
		try { 
			json = JSON.parse(contents) 
		} catch(e) { 
			this.errorContent = [`Error: ${e}`, ...this.usageContent]
		}
		let { port, fileServerPort, root } = json
		if (this.checkArguments(port, fileServerPort, root)) {
			this.isArgumentsValid = true
			this.params = { port: port, fileServerPort: fileServerPort, root }
			this.onChecked()
		}
	}

	checkArguments = (port, fileServerPort, root) => {
		if (port != undefined && fileServerPort != undefined && root != undefined) {
			if (!Number.isNaN(Number(port)) && !Number.isNaN(Number(fileServerPort))) {
				if (port == fileServerPort) {
					this.errorContent = ["Error: port and fileServerPort must be different", ...this.usageContent]
				 	return false
				}
				try {
					fs.readdirSync(root)
				} catch (e) {
					this.errorContent = [`Error: ${e}`, ...this.usageContent]
					return false
				}
				return true
			}
		} else {
			this.errorContent = [`Error: bad formed JSON`, ...this.usageContent]
			return false
		}
	}
}