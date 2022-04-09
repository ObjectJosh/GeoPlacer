const express = require('express');
var favicon = require('serve-favicon');

const app = express();

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

require('./server/database');
const squares = require('./server/routes/squares');
app.use('/squares', squares);

const PORT  = process.env.PORT || 8080;

app.get('', (req, res) => {
    res.send('<h1>Our App</h1>');
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
