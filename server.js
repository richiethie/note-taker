const path = require('path')
const express = require('express')
const app = express()
const PORT = 3000
const notesData = require('./db/db.json')

app.use(express.static("public"))

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

app.get('/', (req, res) => {
    res.sendFile( path.join(__dirname, "public", "index.html") )
})

app.get('/notes', (req, res) => {
    res.sendFile( path.join(__dirname, "public", "notes.html"))
})

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})