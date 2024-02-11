import express from 'express'
import fs from 'fs'
import IP from 'ip'

export class TVShowsServer {
	constructor(port, fileServerPort, root, messenger) {
		this.port = port
		this.fileServerPort = fileServerPort
		this.root = root
		this.messenger = messenger
	}

	start = () => {
		const app = express()
		app.get('/tv-shows', (req, res) => {
			let serverURL = `http://${req.connection.localAddress.replace("::ffff:", "")}`
			let files = []
			let filesPort = this.fileServerPort
			this.getFiles(this.root, files)
			let onlyVideoFiles = files.filter(word => word.includes(".mkv") || word.includes(".mp4"))
			let jsonPrepare = onlyVideoFiles.map(filePath => {
					let filePathWithoutRoot = filePath.replace(this.root, "")
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
			while (i++ < (serverURL.length + this.port.toString().length)) { horizontalFrame += "-"}
			this.messenger([
				`+-----${horizontalFrame}-----------+`,
				`| GET ${serverURL}:${this.port}/tv-shows |`,
				`+-----${horizontalFrame}-----------+`,
				`${JSON.stringify(result, null, 4)}`
			])
			res.send(result)
		})

		app.listen(this.port, () => {
			const ipAddress = IP.address()
			this.messenger([
				`+--------------------------------+`,
				`|               __               |`,
				`|              |__|              |`,
				`|           /\\ |  | _            |`,
				`|          /  \\|  ||X|           |`,
				`|       mo-channel-server        |`,
				`+--------------------------------+`,
				`Use this Server URL on Mo Channel:`,
				`URL   : ${ipAddress}`,
				`Port  : ${this.port}`,
				`Prefix: HTTP`
			])
		})
	}

	getFiles = (dir, files = []) => {
		const fileList = fs.readdirSync(dir)
		for (const file of fileList) {
			const name = `${dir}/${file}`
			if (fs.statSync(name).isDirectory()) {
				this.getFiles(name, files)
			} else {
				files.push(name)
			}
		}
		return files
	}
}