const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const perekrutRouter = require('./src/routes/perekrut')
const pekerjaRouter = require('./src/routes/pekerja')
const pengalamanRouter = require('./src/routes/pengalaman')
const skillRouter = require('./src/routes/skill')
const { PORT } = require('./src/helpers/env')

const app = express();

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.use(express.static('src/uploads'))



app.use(cors())

app.use('/api/v1/pekerja', pekerjaRouter)
app.use('/api/v1/perekrut', perekrutRouter)
app.use('/api/v1/pengalaman', pengalamanRouter)
app.use('/api/v1/skill', skillRouter)


app.listen(PORT, () => {
    console.log(`App is running at port ${PORT}`)
});


