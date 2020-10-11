const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const perekrutRouter = require('./src/routes/perekrut')
const pekerjaRouter = require('./src/routes/pekerja')
const pengalamanRouter = require('./src/routes/pengalaman')
const hireRouter = require('./src/routes/hire')
const portofolioRouter = require('./src/routes/portofolio')
const { PORT } = require('./src/helpers/env')
const path = require('path')
const ejs = require('ejs')

const app = express();
app.set('views', path.join(__dirname,'src/views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.use(express.static('src/uploads'))
app.use(express.static('src/views'))



app.use(cors())

app.use('/api/v1/pekerja', pekerjaRouter)
app.use('/api/v1/perekrut', perekrutRouter)
app.use('/api/v1/pengalaman', pengalamanRouter)
app.use('/api/v1/hire', hireRouter)
app.use('/api/v1/portofolio', portofolioRouter)


app.listen(PORT, () => {
    console.log(`App is running at port ${PORT}`)
});


