import express from 'express'
import morgan from 'morgan';
import 'dotenv/config'
import { db } from './dbConnect.js'
import cors from 'cors'
import { Person } from './mongodb.js';
const app = express()
app.use(cors())
const router = express.Router()

const PORT = process.env.PORT || 3001

await db()
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



router.get('/persons', async (req, res) => {
    const data = await Person.find({})
    res.json(data)
})

router.get('/info', async (req, res) => {
    const exactTotal = await Person.countDocuments({});
    const infoData = {
        time: new Date(),
        dataCount: exactTotal
    }
    res.json(infoData)
})

router.get('/persons/:id', async (req, res) => {
    const personId = req.params.id
    const person = await Person.findById(personId)

    if (person) {
        res.json(person)
    } else {
        res.status(404).json({ message: "user that you're looking for is not found" })
    }
})

router.post('/persons', async (req, res) => {
    const body = req.body


    if (!body.name || !body.number) {
        return res.status(400).json({
            message: "name or number is missing"
        })
    }

    const existingName = await Person.findOne({ name: body.name })
    if (existingName) {
        return res.status(400).json({
            message: "name must be unique, this name already exists"
        })
    }


    const newData = new Person({

        name: body.name,
        number: body.number
    })

    const savedata = await newData.save()


    res.status(201).json(savedata)
})

router.delete('/persons/:id', async (req, res) => {
    const id = req.params.id
    const person = await Person.findById(id)

    if (!person) {
        return res.status(404).json({ message: "person not found" })
    }

    await Person.findByIdAndDelete(id)

    res.status(200).json({
        message: "your data has been removed"
    })
})

router.put('/persons/:id', async (req, res) => {
    const { name, number } = req.body

    const updatedPerson = await Person.findByIdAndUpdate(
        req.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )

    if (updatedPerson) {
        res.json(updatedPerson)
    } else {
        res.status(404).json({ message: "person not found" })
    }
})

app.use('/api', router)

app.listen(PORT, () => {
    console.log(`Server is running in the ${PORT}`)
})