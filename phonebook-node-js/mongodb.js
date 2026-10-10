import mongoose from 'mongoose';


//const password = process.argv[2]
//const url = `mongodb+srv://phyoheinway_db_user:${password}@cluster0.sskuhal.mongodb.net`

mongoose.set('strictQuery', false)
//mongoose.connect(url)//


const PersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    number: {
        type: String,
        required: true,
        minLength: 8,
        match: [/^\d{2,3}-\d{4,7}$/, 'please provide valid ph number']
    }
})

export const Person = mongoose.model('Person', PersonSchema)




if (process.argv.length === 3) {
    const persons = await Person.find({})
    persons.forEach((p) => {
        console.log(`${p.name} and ${p.number}`)
    })
    mongoose.connection.close()

} else if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const newPerson = new Person({
        name,
        number
    })

    await newPerson.save()
    console.log(`added ${name} number ${number} to phonebook`)
    await mongoose.connection.close()


}