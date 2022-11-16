const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const PORT = 3000

app.use(express.static("public"))
app.use(express.json())

app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, "db.json"), "utf-8", function(err, data) {
        if(err) {
            res.status(500).json(err)
            return
        }
        
        const json = JSON.parse(data)
        res.json(json)
    })


    
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

    fs.readFile(path.join(__dirname, 'db.json'), 'utf-8', function(err, data) {
        if(err){
            res.status(500).json(err)
            return
        }
        const notesData = JSON.parse(data)
        notesData.push(newNote)

        fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notesData), function(err) {
            if(err) {
                res.status(500).json(err)
                return
            }
            res.status(200).json(newNote)
        })
    })

})

app.get('/api/notes/:noteType', (req, res) => {
    const noteType = req.params.noteType

    fs.readFile(path.join(__dirname, 'db.json'), 'utf-8', function(err, data) {
        if(err) {
            res.status(500).json(err)
            return
        }
        const notesData = JSON.parse(data)
        const results = notesData.filter(note => note.type === noteType)
    
        if(results.length === 0) {
            res.status(404)
        }
    
        res.json(results)
    })

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