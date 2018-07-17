// Built-in node module, resolves directory paths, and eliminates redundancy (going into and back out of directories) in our case
const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '/../public');
var app = express();
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

// app.get('/', (req, res) => {
// 	res.render('index');
// });

app.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {app};