const path = require('path')
const express = require('express')
const app = express()
const PORT = 3000
const notesData = require('./db/db.json')

app.use(express.static("public"))
app.use(express.json())

app.get('/api/notes', (req, res) => {
    res.json(notesData)
})

app.get('/api/notes/:noteType', (req, res) => {
    const noteType = req.params.noteType
    const results = notesData.filter(note => note.type === noteType)

    if(results.length === 0) {
        res.status(404)
    }

    res.json(results)
})

app.post('/api/notes', (req, res) => {
    const { title, text} = req.body
    if(!title || !text) {
        res.status(400).json({ error: 'Missing Title or Text.'})
        return
    }

    const newNote = {
        ...req.body,
        id: Math.random() //come back to generate better id
    }

    notesData.push(newNote)
    res.json(newNote)
})

app.get('/', (req, res) => {
    res.sendFile( path.join(__dirname, "public", "index.html") )
})

app.get('/notes', (req, res) => {
    res.sendFile( path.join(__dirname, "public", "notes.html"))
})

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})