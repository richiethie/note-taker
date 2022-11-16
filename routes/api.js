const router = require('express').Router()
const path = require('path')
const fs = require('fs')

const dbPath = path.join(__dirname, "..", "db", "db.json")

router.get('/notes', (req, res) => {
    fs.readFile(dbPath, "utf-8", function(err, data) {
        if(err) {
            res.status(500).json(err)
            return
        }
        
        const json = JSON.parse(data)
        res.json(json)
    })
    
})

router.post('/notes', (req, res) => {
    const { title, text} = req.body
    if(!title || !text) {
        res.status(400).json({ error: 'Missing Title or Text.'})
        return
    }

    const newNote = {
        ...req.body,
        id: Math.random() //come back to generate better id
    }

    fs.readFile(dbPath, 'utf-8', function(err, data) {
        if(err){
            res.status(500).json(err)
            return
        }
        const notesData = JSON.parse(data)
        notesData.push(newNote)

        fs.writeFile(dbPath, JSON.stringify(notesData), function(err) {
            if(err) {
                res.status(500).json(err)
                return
            }
            res.status(200).json(newNote)
        })
    })

})

router.get('/notes/:noteType', (req, res) => {
    const noteType = req.params.noteType

    fs.readFile(dbPath, 'utf-8', function(err, data) {
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

router.delete('/notes/:id', (req, res) => {
    const id = req.params.id

    if (!id) {
        res.status(400).json( { error: "We need an id"})
    }

    fs.readFile(dbPath, "utf-8", function(err, data) {
        const notesData = JSON.parse(data)
        const updatedNoteData = notesData.filter(note => id != note.id)
        fs.writeFile(dbPath, JSON.stringify(updatedNoteData), function(err) {
            if(err) {
                return res.status(500).json(err)
            }
            res.json(true)
        })
    })

})


module.exports = router