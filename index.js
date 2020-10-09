const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')

const { PORT } = require('./src/helpers/env')

const app = express();

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.use(express.static('src/uploads'))



app.use(cors())

// app.use('/api/v1/pekerja', router)
// app.use('/api/v1/perekrut', router)


app.listen(PORT, () => {
    console.log(`App is running at port ${PORT}`)
});


