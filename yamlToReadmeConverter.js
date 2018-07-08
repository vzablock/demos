const fs = require('fs');
const path = require('path');
const YAML = require('yamljs');

let folderPaths = [];
let filePaths = [];

const dirs = (p) => {
    fs.readdirSync(p).map(f => {
        if (fs.statSync(path.join(p, f)).isDirectory() && f !== '.git' && f !== 'node_modules') {
            fs.readdirSync(p + f).map(f2 => {
                if (fs.statSync(path.join(p, f, f2)).isDirectory()) {
                    const folderPath = path.join(p, f, f2);
                    folderPaths.push(folderPath);
                    fs.readdirSync(p + f + '/' + f2).map(f3 => {
                        if (f3 === 'info.yaml') {
                            console.log(p, f, f2, f3);
                            const filePath = path.join(p, f, f2, f3);
                            filePaths.push(filePath);
                        }
                    })
                }
            })
        }
    })
}

console.log(dirs('./'));

console.log(folderPaths);
console.log(filePaths);

const parseTags = (tags) => {
    let parsedTags;
    tags.forEach((tag, index) => {
        if (index === 0) {
            parsedTags = `\r\n  - ${tag}`;
        }
        else {
            parsedTags = parsedTags + `\r\n  - ${tag}`;
        }
    });
    return parsedTags;
}

const createReadme = (filePath, index) => {
    YAML.load(filePath, (result) => {
        const readmePath = folderPaths[index] + '\\README.md';
        const content = `# Bitmovin Demo:\r\n${result.title}\r\n\r\n## Demo Description:\r\n${result.description}\r\n\r\n### Detailed Demo Description:\r\n${result.long_description}\r\n\r\n### Tags:\r\n${parseTags(result.tags)}`;
        fs.writeFile(readmePath, content, (error) => {
            if (error) throw error;
            console.log('Saved!');
        })
    })
}

filePaths.forEach((filePath, index) => createReadme(filePath, index));