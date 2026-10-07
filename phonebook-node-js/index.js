import express from 'express'
import morgan from 'morgan';
const app = express()
const router = express.Router()
const PORT = process.env.PORT || 3001
app.use(express.json())

const data = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



router.get('/persons', (req, res) => {
    res.json(data)
})

router.get('/info', (req, res) => {
    const infoData = {
        time: new Date(),
        dataCount: data.length
    }
    res.json(infoData)
})

router.get('/persons/:id', (req, res) => {
    const personId = req.params.id
    const person = data.find(p => p.id === personId)

    if (person) {
        res.json(person)
    } else {
        res.status(404).json({ message: "user that you're looking for is not found" })
    }
})

router.post('/persons', (req, res) => {
    const body = req.body


    if (!body.name || !body.number) {
        return res.status(400).json({
            message: "name or number is missing"
        })
    }

    const existingName = data.find((v) => v.name === body.name)
    if (existingName) {
        return res.status(400).json({
            message: "name must be unique, this name already exists"
        })
    }

    const newData = {
        id: String(data.length + 1),
        name: body.name,
        number: body.number
    }

    data.push(newData)

    res.status(201).json({
        message: "your data has been pushed",
        data: newData
    })
})

router.delete('/persons/:id', (req, res) => {
    const id = req.params.id
    const index = data.findIndex(p => p.id === id)

    if (index === -1) {
        return res.status(404).json({ message: "person not found" })
    }

    data.splice(index, 1)

    res.status(200).json({
        message: "your data has been removed"
    })
})

app.use('/api', router)

app.listen(PORT, () => {
    console.log(`Server is running in the ${PORT}`)
})