
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const TeamProgressCard = ({ memberOKRs }) => {
  const calculateTeamProgress = () => {
    let total = 0;
    let completed = 0;

    Object.values(memberOKRs).forEach((okrs) => {
      total += okrs.length;
      completed += okrs.filter((okr) => okr.status === "completed").length;
    });

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const progress = calculateTeamProgress();

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2 text-white">Team Progress</h2>
      <div className="bg-[#1f2937] p-4 rounded-xl shadow-md w-fit">
        <div className="w-24 h-24">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            styles={buildStyles({
              pathColor: "#10b981",
              textColor: "#ffffff",
              trailColor: "#374151",
              textSize: "18px",
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamProgressCard;
