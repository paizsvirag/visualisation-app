const fs = require('fs'); 
const path = require('path');
const csv = require('csv-parser');
const express = require('express')
const app = express()
const port = 3001

const allData = {}

fs.readdirSync('./db').forEach(file => {
    const fileName = path.basename(file, '.csv')
    const filePath = path.resolve(__dirname, 'db', file);

    if(path.extname(file) !== '.csv') {
        return
    }

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            if (Object.values(data).every(value => value === '')) {
                return
            }
            if (!(fileName in allData)) {
                allData[fileName] = []
            }
            allData[fileName].push(data);
        })
        .on('end', () => {
            console.log(`${fileName} was successfully processed`);
        });
});

app.get('/api/data', (req, res) => res.send(`Hello World!`))

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))