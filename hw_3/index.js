const express = require('express');
const fs = require('fs');
const app = express();

let counters = {};
try {
    const data = fs.readFileSync('counter.txt', 'utf8');
    counters = JSON.parse(data);
} catch (err) {
    console.error(`Error reading file: ${err}`);
}

app.get(['/', '/about'], (req, res) => {
    const url = req.url;
    counters[url] = (counters[url] || 0) + 1;
    fs.writeFile('counter.txt', JSON.stringify(counters), err => {
        if (err) throw err;
    });
    res.send(`<h1>Page <span style="color: red">${url}</span> visited ${counters[url]} times.</h1>`);
});

app.listen(3000, () => {
    console.log('server start port 3000');
});
