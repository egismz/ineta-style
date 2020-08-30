const express = require('express')
    , path = require('path')
    , nunjucks = require('nunjucks')
    , app = express()
    , port = process.env.PORT || 3000

app.use('/', express.static(path.join(__dirname, 'public')));
/*
Configure Nunjucks
nunjucks.configure('src', {
  autoescape: true,
  express: app
});

// Respond to all GET requests by rendering relevant page using Nunjucks
app.get('/', (req, res) => {
  res.render('./public/index.html');  
});

app.get('/about', (req, res) => {
  res.render('./public/about.html');
});

app.get('/contacts', (req, res) => {
  res.render('./public/contacts.html');  
});*/

// Error handlers
app.use((req, res, next) => {
  res.status(404).send(`<h1>404: Page Not Found</h1>`);
  console.log(`Error 404`);    
});

app.use((err, req, res, next) => {
  res.status(500).send(`<h1>500: Internal Server Error</h1>`);
  console.log(`Error 500`);
});

app.listen(port, () => {
   console.log(`Server running on Port ${port}`);
 });
