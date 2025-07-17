import React, { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
const MemberCard = ({
  member,
  okrs = [],
  onAssign,
  onRemove,
  onUpdateStatus,
}) => {
  const [editedOkrs, setEditedOkrs] = useState({});

const computedStatus = (okr) => editedOkrs[okr.id] || okr.status;

const total = okrs.length;
const completed = okrs.filter((okr) => computedStatus(okr) === "completed").length;
const progress = total > 0 ? Math.round((completed / total) * 100) : 0;


  const handleStatusChange = (okrId, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    setEditedOkrs((prev) => ({
      ...prev,
      [okrId]: newStatus,
    }));
  };



  const hasChanges = Object.keys(editedOkrs).length > 0;

const handleSave = async () => {
  const updates = Object.entries(editedOkrs).map(([id, status]) => ({
    id,
    status,
  }));

  try {
    await axios.patch("http://localhost:3000/user/update-task-status", {
      user_id: member.id,
      updates,
    });

     
    if (onUpdateStatus) {
      onUpdateStatus(updates, member.id);
    }

    setEditedOkrs({});  
  } catch (error) {
    console.error("Failed to update OKRs:", error);
    alert("Error saving changes. Please try again.");
  }
};

  return (
    <div className="bg-white p-4 rounded shadow border hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-800">{member.name}</h3>
          <p className="text-gray-500 text-sm">{member.email}</p>
        </div>
        <div className="w-12 h-12">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            styles={buildStyles({
              textSize: "32px",
              pathColor: "#3b82f6",
              textColor: "#111827",
              trailColor: "#d1d5db",
            })}
          />
        </div>
      </div>

      <div className="mt-2">
        <h4 className="text-sm font-semibold text-gray-700 mb-1">OKRs:</h4>
        <ul className="text-sm space-y-1">
          {okrs.map((okr) => {
            const status = editedOkrs[okr.id] || okr.status;
            return (
              <li key={okr.id} className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={status === "completed"}
                    onChange={() => handleStatusChange(okr.id, status)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <div>
                    <span className="font-medium">{okr.title}</span> – {okr.description}
                  </div>
                </label>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    status === "completed" ? "bg-green-200 text-green-800" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {status}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {okrs.length === 0 && (
        <p className="text-sm text-gray-400 mt-2">No OKRs assigned.</p>
      )}

      {hasChanges && (
        <button
          className="mt-3 bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
          onClick={handleSave}
        >
          Save Changes
        </button>
      )}

      <div className="flex gap-2 mt-3">
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
          onClick={() => onAssign(member.id)}
        >
          Assign OKR
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          onClick={() => onRemove(member.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MemberCard;
