import { supabase } from "../connection/supabase_connection.js";

export const team_update=async (req, res) => {
  const teamId = req.params.id;
  const { name } = req.body;

  try {
    const { data, error } = await supabase
      .from("teams")
      .update({ name })
      .eq("id", teamId);

    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(400).json({ status: "error", message: error.message });
    }

    res.json({ status: "success", message: "Team updated", data });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
}