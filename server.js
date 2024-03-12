const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3001
const db = require('./db/db.json')

// Assigns unique ID to user's notes
const { v4:uuidv4 } = require('uuid');

// Enables public folder to be unblocked
app.use(express.static('public'))
app.use(express.json())

// GET /api/notes reads the db.json file and returns all saved notes as JSON
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) throw err;
    let dbData = JSON.parse(data);
    res.json(dbData)
  });
})

// POST /api/notes receives a new note to save on the request body and adds it to db.json before returning new note to client
app.post('/api/notes', (req, res) => {
  const newNote = req.body
  newNote.id = uuidv4()
  db.push(newNote)
  fs.writeFileSync('./db/db.json', JSON.stringify(db))
  res.json(db)
})

// DELETE notes when button is clicked by removing note from db.json, saving and showing updated database on front end
app.delete('/api/notes/:id', (req, res) => {
  const newDb = db.filter((note) =>
    note.id !== req.params.id)
  fs.writeFileSync('./db/db.json', JSON.stringify(newDb))
  readFile.json(newDb)
})

// Routes to Homepage
app.get('/', (req, res) => {
  res.sendFile(path.json(__dirname, 'public', 'index.html'))
})

// Routes to Notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.json(__dirname, 'public', 'notes.html'))
})

// Wildcard route
app.get('*', (req, res) => {
  res.sendFile(path.json(__dirname, 'public', 'index.html'))
})

// App listens on localhost port
app.listen(PORT, () =>
  console.log(`App listening on http://localhost:${PORT}`))
