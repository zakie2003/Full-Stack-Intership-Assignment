import { supabase } from "../connection/supabase_connection.js";
import { GoogleGenAI } from "@google/genai";
import {v4 as uuidv4} from "uuid";
import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); 


export const add_user_to_team=async(req,res)=>{
    try{
        const {team_id,user_id}=req.body;
        
        const {error}=await supabase.from("user_teams").insert({team_id:team_id,user_id:user_id});
        if(error){
            return res.json({"status":"error","message":error});
        }
        return res.json({"status":"sucess","message":"Data Inserted"});
    }
    catch(err){
        return res.json({"status":"try catch error","message":err});
    }
}

export const create_organization=async(req,res)=>{
     try{
        const {orgName,user_id}=req.body;
        const org_id=uuidv4();
        const {error}=await supabase.from("organisations").insert({id:org_id,name:orgName});
        if(error){
            return res.json({ status: "error", message: error.message || error });

        }

        const {org_error}=await supabase.from("user_organisations").insert({organisation_id:org_id,user_id:user_id});
        if(org_error){
            return res.json({ status: "org error", message: error.message || error });

        }
        return res.json({"status":"sucess","message":"Data Inserted"});
    }
    catch(err){
        return res.json({"status":"try catch error","message":err});
    }   
}

export const create_user=async(req,res)=>{
     try{
        const {email,name,password}=req.body;
        
        const {error}=await supabase.from("users").insert({id:uuidv4(),email:email,full_name:name,password:password});
        if(error){
            return res.json({"status":"error","message":error});
        }
        return res.json({"status":"sucess","message":"User Inserted"});
    }
    catch(err){
        return res.json({"status":"try catch error","message":err});
    } 
}

export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const {data,error}=await supabase.from("users").select("*").eq("email",email).eq("password",password);
        if(error){
            return res.json({"status":"error","message":err});
        }
        if(data.length==0){
            return res.json({"status":"success","message":"Not Found"})
        }
        else{
            let user=data[0];
            const token=jwt.sign(      
                {
                    id: user.id,
                    email: user.email,
                    name: user.full_name
                },process.env.JWT_SECRET,{ expiresIn: "1h" } );
            user.token=token;
            return res.json({"status":"success","user":user});
        }
    }
    catch(err){
        return res.json({"status":"error","message":err.message});
    }
}

export const get_organzation=async(req,res)=>{
    const {data,error}=await supabase.from("user_organisations").select("*").eq("user_id",req.query.user_id);
    if(error){
        return res.json({"status":"error","message":error});
    }
    const orgIds = data.map(item => item.organisation_id);
    const { data: orgData, error: orgError } = await supabase
    .from("organisations")
    .select("*")
    .in("id", orgIds);

    if(orgError){
        return res.json({"status":"error","message":orgError});
    }
    return res.json({"status":"success","data":orgData});
}

export const create_dept=async(req,res)=>{
    const {error}=await supabase.from("departments").insert({id:uuidv4(),name:req.body.DeptName,organisation_id:req.body.org_id})
    if(error){
        return res.json({"status":"error","message":error});
    }
    return res.json({"status":"success","message:":"inserted"});
}

export const get_dept=async(req,res)=>{
    const {data,error}=await supabase.from("departments").select("*").eq("organisation_id",req.query.org_id);
    if(error){
        return res.json({"status":"error","message":error});
    }
    return res.json({status:"success",departments:data});
}

export const create_team=async(req,res)=>{
    let uuid=uuidv4();
    let {department_id,teamName,user_id} =req.body;
    const {error}=await supabase.from("teams").insert({id:uuid,name:teamName,department_id:department_id} );
    if(error){
        return res.json({"status":"error 1","message":error});
    }
    const {team_error}=await supabase.from("user_teams").insert({user_id:user_id,team_id:uuid} );
    if(team_error){
        return res.json({"status":"error 2","message":team_error});
    }
    return res.json({status:"success",message:"Done Insertion"});
}

export const get_teams = async (req, res) => {
  let { user_id, department_id } = req.query;

  const { data: team_data, error: team_error } = await supabase
    .from("user_teams")
    .select("*")
    .eq("user_id", user_id);

  if (team_error) {
    return res.json({ status: "error 1", message: team_error });
  }

  const team_ids = team_data.map((i) => i.team_id);
  if (team_ids.length === 0) {
    return res.json({ status: "success", teams: [] });
  }
 
  const { data: full_team, error: full_team_error } = await supabase
    .from("teams")
    .select("*")
    .in("id", team_ids)
    .eq("department_id", department_id);

  if (full_team_error) {
    return res.json({ status: "error 2", message: full_team_error });
  }
  return res.json({ status: "success", teams: full_team });

};


export const get_team_member = async (req, res) => {
  const { team_id } = req.query;

  const { data, error } = await supabase
    .from("user_teams")
    .select("*")
    .eq("team_id", team_id);

  if (error) {
    return res.json({ status: "error", message: error });
  }

  if (!data || data.length === 0) {
    return res.json({ status: "success", members: [] });
  }

  const userIds = data.map((entry) => entry.user_id);

  const { data: userDetails, error: userError } = await supabase
    .from("users")
    .select("*") 
    .in("id", userIds);

  if (userError) {
    return res.json({ status: "error", message: userError });
  }

  return res.json({ status: "success", members: userDetails });
};


export const add_team_member=async(req,res)=>{
    const { team_id, memberID } = req.body;
    const { data: user, error } = await supabase.from("users").select("id").eq("id", memberID).single();

    if (error || !user) return res.json({ status: "error", message: "User not found" });

    await supabase.from("user_teams").insert({ team_id, user_id: user.id });
    return res.json({ status: "success" });
}


export const assign_team_member = async (req, res) => {
  const { team_id, memberID } = req.body;

  if (!team_id || !memberID) {
    return res.status(400).json({ status: "error", message: "Missing team_id or memberID" });
  }

  const { data, error } = await supabase.from("user_teams").insert({
    team_id: team_id,
    user_id: memberID,
  });

  if (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }

  return res.json({ status: "success", message: "Member assigned successfully", data });
};

export const remove_from_team = async (req, res) => {
  const { team_id, memberID } = req.body; 

  if (!team_id || !memberID) {
    return res.status(400).json({ status: "error", message: "Missing team_id or memberID" });
  }

  const { error } = await supabase
    .from("user_teams")
    .delete()
    .match({ team_id: team_id, user_id: memberID });

  if (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }

  return res.json({ status: "success", message: "Member removed successfully" });
};


export const assign_task = async (req, res) => {
  const { title, description, assigned_to, team_id, due_date, status } = req.body;

  if (!title || !assigned_to || !team_id) {
    return res.status(400).json({ status: "error", message: "Missing required fields" });
  }

  const { data, error } = await supabase.from("tasks").insert({
    title,
    description,
    assigned_to,
    team_id,
    due_date,
    status: status || "pending",  
  });

  if (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }

  return res.json({ status: "success", task: data[0] });
};





export const assign_okr=async (req, res) => {
  const { title, description, team_id, assigned_to, start_date, end_date } = req.body;
  console.log(req.body);
  try {
    const { data, error } = await supabase.from("okrs").insert([
      {
        id:uuidv4(),
        title,
        description,
        team_id,
        assigned_to,
        start_date,
        end_date,
        status: "pending",
      },
    ]);

    if (error) throw error;

    res.status(200).json({ status: "success", okr: data });
  } catch (err) {
    console.error("Assign OKR error:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
};


export const get_okrs = async (req, res) => {
  const { user_id, team_id } = req.query;

  try {
    let queryBuilder = supabase.from("okrs").select("*");

    if (user_id && team_id) {
      queryBuilder = queryBuilder
        .eq("assigned_to", user_id)
        .eq("team_id", team_id);
    } else if (user_id) {
      queryBuilder = queryBuilder.eq("assigned_to", user_id);
    } else if (team_id) {
      queryBuilder = queryBuilder.eq("team_id", team_id);
    } else {
      return res.status(400).json({
        status: "error",
        message: "Missing required parameter: user_id or team_id",
      });
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Supabase error:", error);  
      return res.status(500).json({
        status: "error",
        message: "Supabase query failed",
        details: error.message || error,
      });
    }

    return res.status(200).json({
      status: "success",
      okrs: data,
    });
  } catch (err) {
    console.error("Unhandled server error:", err);  
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      details: err.message,
    });
  }
};



export const updateStatusInDB = async (req, res) => {
   const { user_id, updates } = req.body; 
  for (const update of updates) {
    const { id, status } = update;
    const { error } = await supabase
      .from("okrs")
      .update({ status })
      .eq("id", id)
      .eq("assigned_to", user_id);  

    if (error) {
      console.error("Failed to update OKR:", error.message);
    }
  }
};


export const summariseTodo=async(req,res)=>{
    try{
        const {team_id}=req.body;
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
        const {data,error}=await supabase.from("okrs").select("*").eq("team_id",team_id);
        console.log(data);
        const items=data.map((item,index)=>`${index+1})`+item.title+ item.description);
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: items+".Summerize the given points.",
        });
        return res.json({"status":"success","message":response.text});
    }
    catch(err){
        return res.json({"status":"error","message":err});
    }
}