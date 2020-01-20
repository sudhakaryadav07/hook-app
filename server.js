const express = require('express');
const app = express();

app.use((req, res, next) => {
  // console.log(`resquested for: ${req.originalUrl}`);
  next();
});

app.use(express.static(__dirname + '/build'));

app.all('*', (req, res) => {
  console.log(`[TRACE] Server 404 request: ${req.originalUrl}`);
  res.status(200).sendFile(__dirname + '/build/' + 'index.html');
});

var port = process.env.PORT || 6502;
app.listen(port, () => console.log(`Listening on port ` + port));
