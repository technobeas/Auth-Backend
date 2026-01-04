const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

//  Middlewares 
app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());


// Routes
app.use('/user', require('./routes/authRoutes.js'))

app.get('/', (req, res) => {
    res.send('Hello World');
});



const PORT = process.env.PORT || 5000;

const start = async () => {
  try {

    // connect with db
    await connectDB();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(' Server failed to start:', error.message);
    process.exit(1);
  }
};

start();
