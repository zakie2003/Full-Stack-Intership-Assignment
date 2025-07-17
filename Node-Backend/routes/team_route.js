import express from "express";
import { team_update } from "../controller/team_contoller.js";
const teamrouter=express.Router();

teamrouter.put("/update/:id",team_update);

export default teamrouter;