
// require('dotenv').config();

require("dotenv").config({path: 'backend/.env'});
const express = require("express");
const app = express();

const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const paymentRoutes = require("./routes/payments");
const courseRoutes = require("./routes/course");
const contactUsRoute = require("./routes/Contact");


const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const path = require("path")
// const dotenv = require("dotenv");
// dotenv.config();


const port = process.env.PORT || 5000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());


const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://your-frontend-url.vercel.app']  // Production URL
  : ['http://localhost:3000'];  
app.use(
	cors({
		origin: allowedOrigins
	  }
		// origin:"http://localhost:3000",
		// // origin:"https://studynotion-fullstack-90os.onrender.com/",
		// // origin:"https://study-notion-full-stack-seven.vercel.app/",
		// credentials:true,
	)
)

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/contact", contactUsRoute);


// const __dirname1= path.resolve()
// if(process.env.NODE_ENV === 'production'){
// 	app.use(express.static(path.join(__dirname1, '/frontend/build')))
// 	app.get('*', (req,res) =>{
// 		res.sendFile(path.resolve(__dirname1,"frontend", "build", "index.html"))
// 	})

// } else{
// 	app.get("/", (req, res) => {
// 		return res.json({
// 			success:true,
// 			message:'Your server is up and running....'
// 		});
// 	});
// }

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

//def route



app.listen(port, () => {
	console.log(`App is running at ${port}`)
})

