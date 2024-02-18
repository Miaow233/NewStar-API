const fs = require('fs')
const path = require('path')

function copyFolderSync(source, target) {
    if (fs.statSync(source).isFile()) {
        fs.copyFileSync(source, target)
        return
    }
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target)
    }

    const files = fs.readdirSync(source)

    files.forEach((file) => {
        const sourcePath = path.join(source, file)
        const targetPath = path.join(target, file)

        if (fs.statSync(sourcePath).isDirectory()) {
            copyFolderSync(sourcePath, targetPath)
        } else {
            fs.copyFileSync(sourcePath, targetPath)
        }
    })
}

const sourceFolder = path.join(__dirname, '../src')
const targetFolder = path.join(__dirname, '../build')

const folderToCopy = ['assets', 'public', 'views', 'openapi.yaml']

folderToCopy.forEach((folder) => {
    console.log(`Copying ${sourceFolder}\\${folder} to ${targetFolder}\\${folder}`)
    copyFolderSync(path.join(sourceFolder, folder), path.join(targetFolder, folder))
})
