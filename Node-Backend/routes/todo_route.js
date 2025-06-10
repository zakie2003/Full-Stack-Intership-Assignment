import express from "express";
import {addTodo,deleteTodo,getAllTodo,summariseTodo,sendSlack} from "../controller/todo_controller.js"; 
const todorouter=express.Router();

todorouter.post("/add_item",addTodo);
todorouter.post("/summerise_todo",summariseTodo);
todorouter.get("/get_item", getAllTodo);
todorouter.delete("/delete_item/:row_id",deleteTodo);
todorouter.post("/sendSlack",sendSlack);

export default todorouter;