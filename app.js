const config = require('./config.json')
const express = require('express')
const fs = require('fs')
const app = express()
const port = config.port

app.get('/teste', (req, res) => {
	let files = []
	let root = config.root
	let filesPort = config.fileServerPort
	getFiles(root, files)
	let onlyVideoFiles = files.filter(word => word.includes(".mkv") || word.includes(".avi"))
	let jsonPrepare = onlyVideoFiles.map( filePath => {
			let filePathWithoutRoot = filePath.replace(root, "")
			return {
				name: filePathWithoutRoot,
				url: `http://${req.connection.localAddress.replace("::ffff:", "")}:${filesPort}${filePathWithoutRoot}`
			}
		}
	)

	let result = {}

	jsonPrepare.forEach(elem => {
		let key = elem.name.split("/")[1]
		let newElem = elem
		newElem.name = newElem.name.replace(`/${key}/`, "")
		if (result[key] == undefined) {
			result[key] = [newElem]
		} else {
			result[key].push(newElem)
		}
	})

	res.send(result)
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

// Recursive function to get files
function getFiles(dir, files = []) {
	// Get an array of all files and directories in the passed directory using fs.readdirSync
	const fileList = fs.readdirSync(dir)
	// Create the full path of the file/directory by concatenating the passed directory and file/directory name
	for (const file of fileList) {
		const name = `${dir}/${file}`
		// Check if the current file/directory is a directory using fs.statSync
		if (fs.statSync(name).isDirectory()) {
			// If it is a directory, recursively call the getFiles function with the directory path and the files array
			getFiles(name, files)
		} else {
			// If it is a file, push the full path to the files array
			files.push(name)
		}
	}
	return files
}