const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
const path = require('path')

dotenv.config()

connectDB()

const app = express()

app.use(cors())
app.use(express.json())

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/', (req, res) => {
    res.send('Aarunya Backend Running...')
})

// API Routes
const productRoutes = require('./routes/productRoutes')
app.use('/api/products', productRoutes)

const contactRoutes = require('./routes/contactRoutes')
app.use('/api/contact', contactRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    )
})