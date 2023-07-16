require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path=require("path");
var _=require("lodash");
let alert=require('alert');
const app = express();
const multer=require("multer");
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const mongoose=require('mongoose');
mongoose.set('strictQuery', false);
const storage=multer.diskStorage({
  destination:function(req,file,cb){
    return cb(null,"./uploads");
  },
filename:function(req,file,cb){
  return cb(null,`${Date.now()}-${file.originalname}`);
}
})
// const upload = multer({ storage })
const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024, // 1MB limit
  },
  fileFilter: (req, file, cb) => {
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"));
    }
  },
});


main().catch(err => console.log(err));
 
async function main() {
  try{
  await mongoose.connect(process.env.mongodb_db_link);
  console.log("Connected");
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
}catch (err) {
  console.error("Error while connecting to MongoDB:", err);
}
  app.get("/",function(req,res){
    res.render("fud");
  })
  const resschema=new mongoose.Schema({
    name:{
      type:String,
    required:true
  },
  state:{
    type:String,
    required:true,
  },
  city:{
    type:String,
    required:true,
  },
  area:{
    type:String,
    required:true,
  },
  pin:{
    type:Number,
    required:true
  },
phno:{
  type:Number,
  required:true
},
email:{
  type:String,
  required:true
},
closingday: {
  type:Array,
  default:[],
  required:true
},
menu : { type: String }

  })

  const Res=new mongoose.model("res",resschema);
  
  app.post("/", upload.single("menu"),function(req,res){

    const nam=req.body.name;
    const sta=req.body.state;
    const cty=req.body.city;
    const ar=req.body.area;
    const pi=req.body.pin;
    const phn=req.body.phn;
    const em=req.body.email;
    const menuFile = req.file;

    const clo=[];
    if(req.body.mon){
      clo.push("Monday");
    }
    if(req.body.tue){
      clo.push("Tuesday");
    }
    if(req.body.wed){
      clo.push("Wednesday");
    }
    if(req.body.thu){
      clo.push("Thursday");
    }
    if(req.body.fri){
      clo.push("Friday");
    }
    if(req.body.sat){
      clo.push("Saturday");
    }
    if(req.body.sun){
      clo.push("Sunday");
    }
    const fil=req.body.fil;
    const bhu=new Res({
      name:nam,
      state:sta,
      city:cty,
      area:ar,
      pin:pi,
      phno:phn,
      email:em,
      closingday:clo,
     menu: menuFile.filename
      // source:fil,
    })
    
     bhu.save();
    // console.log(req.body);
// console.log(req.file);
res.redirect("/");
  
  })
  app.get("/:filename", (req, res) => {
  const filename = req.params.filename;

  // Construct the file path based on the 'uploads' folder and the filename
  const filePath = path.join(__dirname, "uploads", filename);

  // Use res.sendFile() to serve the file
  res.sendFile(filePath);
});
// app.post("/menu",upload.single("menu"),function(req,res){
// console.log(req.body);
// console.log(req.file);
// res.redirect("/");
// })
app.listen(process.env.PORT||3000,function(){
  console.log("server started ");
})
}
