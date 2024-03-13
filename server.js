const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const PORT = process.env.PORT || 3001
const db = require('./db/db.json')

// Assigns unique ID to user's notes
const { v4:uuidv4 } = require('uuid');

// Enables public folder to be unblocked
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// GET /api/notes reads the db.json file and returns all saved notes as JSON
app.get('/api/notes', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8')
  res.send(data)
})

// POST /api/notes receives a new note to save on the request body and adds it to db.json before returning new note to client
app.post('/api/notes', (req, res) => {
  const newNote = req.body
  newNote.id = uuidv4()
  let rawData = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8')
  let noteArray = JSON.parse(rawData)
  let uuid = uuidv4()
  noteArray.push(newNote)
  const fileDb = path.join(__dirname, './db/db.json')
  fs.writeFileSync(fileDb, JSON.stringify(noteArray))
  res.json(newNote)
})

// DELETE notes when button is clicked by removing note from db.json, saving and showing updated database on front end
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  let rawData = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8')
  let noteArray = JSON.parse(rawData)
  if (noteArray.length > 0){
    const found = noteArray.some(note => note.id === id)
    if (found) {
      newNoteArray = noteArray.filter(note => note.id !== id)
      const fileDb = path.join(__dirname, './db/db.json')
      fs.writeFileSync(fileDb, JSON.stringify(newNoteArray))
      console.log(`Delete It`)
      res.json(newNoteArray)
    } else {
      console.log(`Not Found`)
      res.json(`Not Found`)
    }
  } else {
    console.log(`Database Is Empty`)
    res.json(`Database Is Empty`)
  }
});

// Routes to Notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'))
})

// Routes to Home page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// App listens on localhost port
app.listen(PORT, () =>
  console.log(`App listening on http://localhost:${PORT}`))
