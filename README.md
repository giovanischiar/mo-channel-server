<h1 align="center">
  <img src="readme-res/cover.svg"><br>  
  mo-channel-server
</h1>

<p align="center">
  <strong>Host your own videos to be served on the Mo Channel Android TV app!</strong><br>
  This server-side application allows you to run a server that serves the videos from your computer, which can be watched on your TV using the  <a href="https://github.com/giovanischiar/mo-channel">Mo Channel</a> Android TV Application.
</p>

- [Usage](#usage)
  - [Run by Double-Clicking the Binary](#run-by-double-clicking-the-binary)
  - [Run using the Terminal/Prompt with a Config File](#run-using-the-terminalprompt-with-a-config-file)
  - [Run using the Terminal/Prompt with Direct Arguments](#run-using-the-terminalprompt-with-direct-arguments)
- [Technologies](#technologies)
- [Future Tasks](#future-tasks)

## Usage

This server-side application is intended to be used together with the Android TV app [Mo Channel](https://github.com/giovanischiar/mo-channel)

[Download](https://github.com/giovanischiar/mo-channel-server/releases/) the appropriate binary according to your operating system.

### Run by Double-Clicking the Binary

```
Type the TV Shows Root Path:
```

The Terminal or Command Prompt will appear with the message above, asking you to type the path to the directory where the TV shows are located. After that, it will create a file so you won't need to type it again next time you run it.

### Run using the Terminal/Prompt with a Config File
Create a file named `config.json` using this structure:

```js
  { 
      port          : /* Server port number e.g.: 3000 */
      fileServerPort: /* File server port number e.g.: 8080 (it can't be the same as server port) */
      root          : /* Path to tv shows directory e.g.: \"path/to/tv-shows/\"*/
  }
```

And then add the path of this file as an argument when running it in the terminal.

```
./mo-channel-server --config config.json
```

### Run Using the Terminal/Prompt with Direct Arguments.

```
./mo-channel-server --port 3000 --file-server-port 8080 --root ./
```

After inputting the arguments, the output will be something like this:"

```
+--------------------------------------+
| HTTP File Server created. Port: 8080 |
+--------------------------------------+
+--------------------------------+
|               __               |
|              |__|              |
|           /\ |  | _            |
|          /  \|  ||X|           |
|       mo-channel-server        |
+--------------------------------+
Use this Server URL on Mo Channel:
URL   : /* this is the IP address you will input on Mo Channel app */
Port  : /* this is the port you will input on Mo Channel app */
Prefix: HTTP
```

Then just use the information displayed to input the Server URL into the Mo Channel app.

# Technologies
|Technology|Purpose|
|:-:|:-:|
|<img src="https://avatars.githubusercontent.com/u/9950313?s=200&v=4" width="50" height="50"><br>[nodejs](https://nodejs.org/)|The runtime platform|
|<img src="https://avatars.githubusercontent.com/u/10845406?s=48&v=4" width="50" height="50"><br>[http-server](https://github.com/http-party/http-server#readme)|The HTTP file server of the videos|
|<img src="https://avatars.githubusercontent.com/u/14985020?s=48&v=4" width="50" height="50"><br>[PKG](https://github.com/vercel/pkg)|Generate the binaries of the application|
|<img src="https://babeljs.io/img/babel.svg" width="50" height="50"><br>[Babel](https://babeljs.io/)|Generate the compatible js to use in the pkg to generate the binaries|

## Future Tasks
  - Add icon to the binaries