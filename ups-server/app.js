const express = require('express')
const app = express()
const port = 3001

app.use(express.json());
app.use(express.urlencoded());

app.get('/language', (req, res) => {
  res.send({
    id: 1,
    name: 'Type Script',
    updatedAt: (new Date()).toISOString(),
  })
})

app.post('/language', (req, res) => {
  const body = req.body;
  // FIXME : add body validation
  console.log('TODO: save in database:', body);
  res.sendStatus(204);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})