import express from "express"
import dotenv from "dotenv"

dotenv.config({
    path: "./config/config.env",
})

const app = express()
const PORT = process.env.PORT || 3000

const data = { name: "John", age: 30 }

app.get('/api/v1/bootcamps', (req, res) => {
  const data = { success: true };
  res.send(`
    <h1>Hello from express</h1>
    <script>window.data = ${JSON.stringify(data)};</script>
  `);
});

// JSON API endpoint
app.get('/api/data', (req, res) => {
  res.status(201).json({ message: 'Hello from API', data: data });
});

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} at port: ${PORT}`)
})
