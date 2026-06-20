require('dotenv').config();
const express = require('express');
const cors  = require('cors');
const mongoose = require('mongoose');

const app = express();


app.use(cors({ origin: process.env.CLIENT_URL}));
app.use(express.json());

const authRoutes = require('./routes/auth');
const internshipRoutes = require('./routes/internships')
const applicationRoutes = require('./routes/applications');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log('MongoDB connected'))
    .catch((err)=> console.error('MongoDB connection error:',err));

app.get('/',(req,res)=>{
    res.json({message: 'API is running '});
})

app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`);
})