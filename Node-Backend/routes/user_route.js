import express from "express";
import { create_dept, create_organization,create_team, create_user,get_organzation,login ,get_dept,get_teams, get_team_member, add_team_member, remove_from_team, assign_team_member, assign_okr, get_okrs} from "../controller/user_controller.js";
const userrouter=express.Router();

userrouter.post("/signin",create_user);

userrouter.post("/login",login);

userrouter.post("/create_org",create_organization);

userrouter.post("/create_dept",create_dept);

userrouter.post("/create_team",create_team);

userrouter.post("/add_team_member",add_team_member);

userrouter.post("/assign_team_member", assign_team_member);

userrouter.post("/assign_okr",assign_okr);

userrouter.get("/get_org",get_organzation);

userrouter.get("/get_depts",get_dept);

userrouter.get("/get_teams",get_teams);

userrouter.get("/get_team_members",get_team_member);

userrouter.get("/get_okrs",get_okrs);

userrouter.delete("/remove_team_member",remove_from_team);



export default userrouter;