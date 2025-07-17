import { useState, useEffect } from "react";
import NavBar from "../components/navbar";
import axios from "axios";
import { useLocation } from "react-router-dom";
import MemberCard from "../components/MemberCard";

function Teamboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialDeptId = queryParams.get("dept_id");

  const [department_id] = useState(initialDeptId);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create_team" | "add_member"
  const [teamName, setTeamName] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberID, setMemberID] = useState("");
  const [okrTitle, setOkrTitle] = useState("");
  const [okrDescription, setOkrDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assignedTo, setAssignTo] = useState(""); 
  const [memberOKRs, setMemberOKRs] = useState({});
  const [showSummaryModal, setSummaryModal] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState(null);
  const [editedTeamName, setEditedTeamName] = useState("");



  const openModal = (type) => {
    setShowDropdown(false);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setTeamName("");
    setMemberID("");
  };

const getTeamMembers = async (teamId) => {
  try {
    const response = await axios.get(`http://localhost:3000/user/get_team_members?team_id=${teamId}`);
    if (response.data.status === "success") {
      const fetchedMembers = response.data.members || [];
      setMembers(fetchedMembers);

      // Now fetch OKRs for each member
      const okrsMap = {};
      for (const member of fetchedMembers) {
        const okrResponse = await axios.get(`http://localhost:3000/user/get_okrs?user_id=${member.id}&team_id=${teamId}`);
        okrsMap[member.id] = okrResponse.data.okrs || [];
      }
      setMemberOKRs(okrsMap);

    } else {
      setMembers([]);
      console.error("Failed to fetch members:", response.data.message);
    }
  } catch (err) {
    setMembers([]);
    console.error("Error fetching members:", err);
  }
};


  const getUserTeams = async () => {
    try {
      if (!department_id) {
        console.warn("No department ID found.");
        setTeams([]);
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/user/get_teams?department_id=${department_id}&user_id=${localStorage.getItem("user_id")}`
      );
      if (response.data.status === "success") {
        setTeams(response.data.teams || []);
      } else {
        console.error("Failed to fetch teams:", response.data.message);
        setTeams([]);
      }
    } catch (err) {
      console.error("Error fetching teams:", err);
      setTeams([]);
    }
  };


  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/user/create_team", {
        teamName,
        department_id,
        user_id: localStorage.getItem("user_id"),
      });
      if (response.data.status === "success") {
        await getUserTeams();
        closeModal();
      } else {
        console.error("Error creating team:", response.data.message);
      }
    } catch (err) {
      console.error("Create team error:", err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/user/add_team_member", {
        team_id: selectedTeam,
        memberID: memberID,  
      });

      if (response.data.status === "success") {
        await getTeamMembers(selectedTeam);
        closeModal();
      } else {
        console.error("Add member error:", response.data.message);
      }
    } catch (err) {
      console.error("Error adding member:", err);
    }
  };


const handleRemoveMember = async (memberId) => {
  try {
    const response = await axios.delete("http://localhost:3000/user/remove_team_member", {
      data: {
        team_id: selectedTeam,
        memberID: memberId,
      },
    });
    if (response.data.status === "success") {
      await getTeamMembers(selectedTeam);
    } else {
      console.error("Delete error:", response.data.message);
    }
  } catch (err) {
    console.error("Error removing member:", err);
  }
};

const handleAssignMember = (memberId) => {
  setAssignTo(memberId);
  setModalType("assign_okr");
  setShowModal(true);
};

const handleEditTeam = (team) => {
  setTeamToEdit(team);
  setEditedTeamName(team.name);
  setEditModalOpen(true);
};


const handleUpdateTeam = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.put(
      `http://localhost:3000/team/update/${teamToEdit.id}`,
      { name: editedTeamName }
    );

    if (response.data.status === "success") {
      await getUserTeams();
      setEditModalOpen(false);
      setTeamToEdit(null);
      setEditedTeamName("");
    } else {
      console.error("Failed to update team:", response.data.message);
    }
  } catch (err) {
    console.error("Update team error:", err);
  }
};


  const summarize = async () => {
    try {
      let response = await axios.post("http://localhost:3000/user/summary", {
        team_id: selectedTeam,
      });
      setSummaryText(response.data.message);
      setSummaryModal(true);  
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    getUserTeams();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 border-r border-gray-300 p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Teams</h2>
          <ul className="space-y-2 text-gray-700">
            {teams.length === 0 ? (
              <li className="text-gray-500">No Teams found.</li>
            ) : (
              teams.map((team) => (
                <li
                  key={team.id}
                  className={`flex justify-between items-center hover:bg-gray-200 px-3 py-2 rounded cursor-pointer ${
                    selectedTeam === team.id ? "bg-gray-300" : ""
                  }`}
                >
                  <span
                    onClick={() => {
                      setSelectedTeam(team.id);
                      getTeamMembers(team.id);
                    }}
                  >
                    {team.name}
                  </span>
                  <button
                    onClick={() => handleEditTeam(team)}
                    className="text-blue-500 hover:text-blue-700 text-sm ml-2"
                  >
                    ✏️
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

    {showSummaryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-96 p-6 rounded shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <p className="text-gray-800 whitespace-pre-line">{summaryText}</p>
            <button
              onClick={() => setSummaryModal(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

        {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Team</h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-red-600 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateTeam}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Team Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={editedTeamName}
                  onChange={(e) => setEditedTeamName(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}



        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 bg-white shadow relative">
            <h1 className="text-2xl font-semibold text-gray-800">Team Management</h1>

            <div className="relative">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Create +
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
                    onClick={() => openModal("create_team")}
                  >
                    Create Team
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {selectedTeam ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Team Members</h2>
                  <button onClick={summarize} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                      Sumerize
                    </button>
                  <button
                    onClick={() => openModal("add_member")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Add Member
                  </button>
                </div>
                {members.length === 0 ? (
                  <p className="text-gray-500">No members in this team.</p>
                ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {members.map((member) => (
                        <MemberCard
                          key={member.id}
                          member={member}
                          okrs={memberOKRs[member.id] || []}
                          onAssign={handleAssignMember}
                          onRemove={handleRemoveMember}
                        />
                      ))}
                </ul>


                )}
              </>
            ) : (
              <p className="text-gray-600">Select a team to view its members.</p>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {modalType === "create_team" ? "Create Team" : "Add Member"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-red-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {modalType === "create_team" && (
              <form onSubmit={handleTeamSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Team Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Submit
                </button>
              </form>
            )}

            {modalType === "add_member" && (
              <form onSubmit={handleAddMember}>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Member ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={memberID}
                    onChange={(e) => setMemberID(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add Member
                </button>
              </form>
            )}
          </div>
        </div>
      )}

{showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-6 w-96">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {modalType === "create_team"
            ? "Create Team"
            : modalType === "add_member"
            ? "Add Member"
            : "Assign OKR"}
        </h2>
        <button
          onClick={closeModal}
          className="text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {modalType === "create_team" && (
        <form onSubmit={handleTeamSubmit} className="space-y-4 bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold text-gray-800">Create New Team</h2>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter team name"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            Create Team
          </button>
        </form>
      )}

      {modalType === "add_member" && (
        <form onSubmit={handleAddMember} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md border">
          <input
            type="text"
            value={memberID}
            onChange={(e) => setMemberID(e.target.value)}
            placeholder="Enter Member ID"
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-200"
          >
            Add
          </button>
        </form>


      )}

      {modalType === "assign_okr" && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const response = await axios.post("http://localhost:3000/user/assign_okr", {
                title: okrTitle,
                description: okrDescription,
                team_id: selectedTeam,
                assigned_to: assignedTo,
                start_date: startDate,
                end_date: endDate,
              });

              if (response.data.status === "success") {
                closeModal();
                alert("OKR assigned successfully");
              } else {
                console.error(response.data.message);
              }
            } catch (err) {
              console.error("Assign OKR Error:", err);
            }
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={okrTitle}
              onChange={(e) => setOkrTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded"
              value={okrDescription}
              onChange={(e) => setOkrDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">End Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Assign OKR
          </button>
        </form>
      )}
    </div>
  </div>
)}



    </div>
  );
}

export default Teamboard;
