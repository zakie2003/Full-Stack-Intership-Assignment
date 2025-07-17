import { createClient } from '@supabase/supabase-js'
import dotenv from "dotenv";

const supabaseUrl = "https://scgiddfzsaialeumyloe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjZ2lkZGZ6c2FpYWxldW15bG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjM0MzYsImV4cCI6MjA2MzU5OTQzNn0.4F2bn-jyF5iSs3oHGinsh7cTg5kP4_pw4_4wfNDuWUs";

export const supabase = createClient(supabaseUrl, supabaseKey);