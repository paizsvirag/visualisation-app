const fs = require('fs'); 
const path = require('path');
const csv = require('csv-parser');
const express = require('express')
const app = express()
const port = 3001

app.use(express.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

app.get('/',(req,res) => {
    res.send('.')
})

app.get('/data', (req, res) => {
    res.json({allData})
})
app.listen(port, () => console.log(`App listening at http://localhost:${port}`))