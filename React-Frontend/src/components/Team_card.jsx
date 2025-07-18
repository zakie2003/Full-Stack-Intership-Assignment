import React from "react";

const TeamCard = ({ teamName, members, memberOKRs }) => {
  // Calculate overall team progress
  const allOKRs = members.flatMap((member) => memberOKRs[member.id] || []);
  const total = allOKRs.length;
  const completed = allOKRs.filter((okr) => okr.status === "completed").length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-blue-700">{teamName}</h2>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Team Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Members List */}
      {members.length === 0 ? (
        <p className="text-gray-500">No members in this team.</p>
      ) : (
        <ul className="space-y-2">
          {members.map((member) => (
            <li
              key={member.id}
              className="bg-gray-100 text-gray-800 rounded p-2 border"
            >
              👤 {member.full_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeamCard;
