
const Joi = require('@hapi/joi');
const express = require('express')
const app = express()

app.use(express.json())

const courses = [
    { id: 1, name: 'python' },
    { id: 2, name: 'java' },
    { id: 3, name: 'javascript' },
    { id: 4, name: 'node' }
]

//basic get request
app.get('/', (request, response) => {
    response.send('Hello Everyone!!!')
})

//get request to get the courses
app.get('/api/courses', (request, response) => {
    response.send(courses)
})

//get request to get the course by id
app.get('/api/courses/:id', (request, response) => {
    const course = courses.find(c => c.id === parseInt(request.params.id))
    if (!course) {
        response.status(404).send('The course with a given id was not found')
    } else {
        response.status(200).send(course)
    }
})

//post request to add a new course with input validation by joi
app.post('/api/courses', (request, response) => {

    const { error } = validateCourse(request.body) // equivalend to result.error
    if (error) {
        //400 Bad request
        response.status(400).send(error.message)
        return
    }

    const course = {
        id: courses.length + 1,
        name: request.body.name
    };
    courses.push(course)
    response.send(course)
})


//put request to update the existing obj
app.put('/api/courses/:id', (request, response) => {

    //Look up the course - If it doesnt exists return 404 -  Not Found
    const course = courses.find(c => c.id === parseInt(request.params.id))
    if (!course) {
        response.status(404).send('The course with a given id was not found')
        return
    }

    //Validate - If it is invalid  return 400 - Bad request
    // const validationResult = validateCourse(request.body)
    const { error } = validateCourse(request.body) // equivalend to result.error

    if (error) {
        //400 Bad request
        response.status(400).send(error.message)
        return
    }

    //Update course
    course.name = request.body.name
    //Return the updated course
    response.send(course)

})

//delete request
app.delete('/api/courses/:id', (request, response) => {

    //Look up the course - Not Exist return 404
    //else delete and send the same course
    const course = courses.find(c => c.id === parseInt(request.params.id))
    if (!course) {
        response.status(404).send('The course with a given id was not found')
        return
    }   

    const index = courses.indexOf(course)
    courses.splice(index, 1) // go to index and remove one obj
    response.send(course)

})  

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return schema.validate(course)
}

// Env variable PORT
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))    