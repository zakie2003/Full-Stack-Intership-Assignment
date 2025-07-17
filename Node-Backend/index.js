import express from "express";
import dotenv from "dotenv";
import todorouter from "./routes/todo_route.js";
import cors from "cors";
import userrouter from "./routes/user_route.js";
dotenv.config();
const port=process.env.PORT ?? 3000;

const app=express();
app.use(cors({"origin":["http://localhost:5173","https://illustrious-dragon-77f03d.netlify.app"]}))
app.use(express.json()); 


app.use("/todo",todorouter);
app.use("/user",userrouter);

app.get("/",(req,res)=>{
    res.send({"message":"This is the Node API"});
})

app.listen(port,()=>{
    console.log("Server Started at port :"+port);
})