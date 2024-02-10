const express = require('express')
const fs = require('fs')
const app = express()
const IP = require('ip');
const { spawn } = require("child_process");

function moChannelServer() {
	checkParameters()
}

function printUsage() {
	let fileNames = process.argv[1].split("/")
	let fileName = fileNames[fileNames.length - 1]
	console.log(`Usage: ${fileName} --config config.json`)
	console.log(
		"Create a file config.json\n" +
		"{\n" + 
		"    port          : /* Server port number e.g.: 8080 */,\n" +
		"    fileServerPort: /* File server port number e.g.: 3000 (it can't be the same as server port) */,\n" +
		"    root          : /* Path to tv shows directory e.g.: \"path/to/tv-shows/\"*/\n" +
		"}"
	)
}

function checkParameters() {
	if (process.argv.length == 2) {
		printUsage()
		return
	}

	var configLabelIndex = process.argv.indexOf("--config")
	var configIndex = configLabelIndex + 1
	if (configLabelIndex != -1 && configIndex < process.argv.length) {
		fs.readFile(process.argv[configIndex], function(err, data) { 
			if (!err) {
				onFileRead(data) 
			} else {
				console.log(err)
				printUsage()
			}
		});
	} else {
		printUsage()
	}
} 

function onFileRead(contents) {
	var json = {}
	try { 
		json = JSON.parse(contents) 
	} catch(e) { 
		console.log(e)
		printUsage() 
		return 
	}
	let { port, fileServerPort, root } = json
	if (port != undefined && fileServerPort != undefined && root != undefined) {
		if (port == fileServerPort) {
			console.log("Error: port and fileServerPort must be different")
			printUsage()
			return
		}

		try {
			fs.readdirSync(root)
		} catch (e) {
			console.log(e)
			printUsage()
			return
		}
		console.log("Starting HTTP File Server")
		startFileServer(fileServerPort, root)
		startServer(port, fileServerPort, root)
	} else {
		console.log("Error: bad formed JSON")
		printUsage()
	}	
}

function startFileServer(port, root) {
	const fileServer = spawn("node_modules/http-server/bin/http-server", [root, "--no-dotfiles", "--port", port])

	fileServer.stdout.on("data", data => {
	 	console.log(
	 		`+-------------------------+\n` +
	 		`| HTTP File Server stdout |\n` +
	 		`+-------------------------+\n`
	 	)
	 	console.log(`${data}`)
	});

	fileServer.stderr.on("data", data => {
	 	console.log(
	 		`+-------------------------+\n` +
	 		`| HTTP File Server stderr |\n` +
	 		`+-------------------------+\n`
	 	)
	 	console.log(`${data}`)
	 	console.log(`+-------------------------+`)
	});

	fileServer.on('error', (error) => {
	 	console.log(
	 		`+-------------------------+\n` +
	 		`| HTTP File Server error  |\n` +
	 		`+-------------------------+\n`
	 	)
	 	console.log(`${error}`)
	 	console.log(`+-------------------------+`)
	});

	fileServer.on("close", code => {
		console.log(
	 		`+-------------------------+\n`,
	 		`| HTTP File Server close  |\n`,
	 		`+-------------------------+\n`
	 	)
	  console.log(`child process exited with code ${code}`)
	  console.log(`+-------------------------+`)
	});
}

function startServer(port, fileServerPort, root) {
	app.get('/tv-shows', (req, res) => {
		let serverURL = `http://${req.connection.localAddress.replace("::ffff:", "")}`
		let files = []
		let filesPort = fileServerPort
		getFiles(root, files)
		let onlyVideoFiles = files.filter(word => word.includes(".mkv") || word.includes(".mp4"))
		let jsonPrepare = onlyVideoFiles.map( filePath => {
				let filePathWithoutRoot = filePath.replace(root, "")
				return {
					name: filePathWithoutRoot,
					url: `${serverURL}:${filesPort}${filePathWithoutRoot}`
				}
			}
		)

		let result = []

		jsonPrepare.forEach(elem => {
			let key = elem.name.split("/")[1]
			let newElem = elem
			newElem.name = newElem.name.replace(`/${key}/`, "")
			let tvShow = result.filter(tvShow => tvShow.name == key)
			if (tvShow.length == 0) {
				result.push({ name: key, episodes: [newElem] })
			} else {
				result[result.indexOf(tvShow[0])].episodes.push(newElem)
			}
		})

		let i = 0
		let horizontalFrame = ""
		while (i++ < (serverURL.length + port.toString().length)) { horizontalFrame += "-"}
		console.log(
			`+-----${horizontalFrame}-----------+\n` +
			`| GET ${serverURL}:${port}/tv-shows |\n` +
			`+-----${horizontalFrame}-----------+\n` +
			`${JSON.stringify(result, null, 4)}`
		)
		res.send(result)
	})

	app.listen(port, () => {
		const ipAddress = IP.address()
		console.log(
			`+--------------------------------+\n` +
			`|               __               |\n` +
			`|              |__|              |\n` +
			`|           /\\ |  | _            |\n` +
			`|          /  \\|  ||X|           |\n` +
			`|       mo-channel-server        |\n` +
			`+--------------------------------+\n` +
			`Use this Server URL on Mo Channel:\n` +
			`URL   : ${ipAddress}\n` +
			`Port  : ${port}\n` +
			`Prefix: HTTP`
		)
	})
}


function getFiles(dir, files = []) {
	const fileList = fs.readdirSync(dir)
	for (const file of fileList) {
		const name = `${dir}/${file}`
		if (fs.statSync(name).isDirectory()) {
			getFiles(name, files)
		} else {
			files.push(name)
		}
	}
	return files
}

moChannelServer()