const express=require('express')
const app=express()
const mongoose=require('mongoose')
require('dotenv').config();
const cors=require('cors')
const productrouter =require('./Routers/productrRouter')
const fileUpload = require('express-fileupload');
const userRouter=require('./Routers/userRoute')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  useTempFiles: true
}));
// app.use(cors({
//   origin: "https://orufy-tech-kd7e.onrender.com",
//   credentials: true
// }));
app.use(cors());

app.use('/products',productrouter)
app.use('/user',userRouter);


mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Database connected successfully"))
.catch(()=>console.log("Error While Connecting Database"))

app.listen(process.env.PORT,()=>console.log(`Server is running on PORT: ${process.env.PORT}`))