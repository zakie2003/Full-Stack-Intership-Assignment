import { supabase } from "../connection/supabase_connection.js";
import { GoogleGenAI } from "@google/genai";
import {v4 as uuidv4} from "uuid";
export const addTodo=async(req,res)=>{
    try{
        const { name } = req.body;
        if(!name){
            return res.json({"status":"error","message":"Empty Message"});
        }
        const {error}=await supabase.from("temp").insert({row_id:uuidv4(),name:name});
        if(error){
            return res.json({"status":"error","message":error.message});
        }
        return res.json({"status":"success","message":"Data Inserted"});
    }
    catch(err){
        return res.json({"status":"error","message":err})
    }
}


export const deleteTodo=async(req,res)=>{
    const {row_id}=req.params;
    if(!row_id){
        return res.json({"status":"error","message":"Empty Message"});
    }

    const {error}=await supabase.from("temp").delete().eq("row_id",row_id);
    if(error){
        return res.json({"status":"error","message":error.message});
    }
    return res.json({"status":"success","message":"Data Deleted"});

}


export const getAllTodo=async(req,res)=>{
    try
    {
        const {data,error}=await supabase.from("temp").select("*");
        return res.json({"status":"success","message":"Data Retrived","Data":data});
    }
    catch(err){
        return res.json({"status":"error","message":err})
    }
}


export const summariseTodo=async(req,res)=>{
    try{
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
        const {data,error}=await supabase.from("temp").select("*");
        const items=data.map((item,index)=>`${index+1})`+item.name);
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