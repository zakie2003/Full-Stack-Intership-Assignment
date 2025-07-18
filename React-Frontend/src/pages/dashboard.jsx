import { useState, useEffect } from "react";
import NavBar from "../components/navbar";
import axios from "axios";
function DashBoard() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [modalType, setModalType] = useState(null); // "organization" or "team"
  const [showModal, setShowModal] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [orgDesc, setOrgDesc] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [teamOrg, setTeamOrg] = useState("");
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [departments, setDepartments] = useState([]);


  const openModal = (type) => {
    setModalType(type);
    setShowDropdown(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setOrgName("");
    setOrgDesc("");
    setTeamName("");
    setTeamOrg("");
  };

  const handleOrgSubmit = async(e) => {
    e.preventDefault();
    let response= await axios.post("https://full-stack-intership-assignment.onrender.com/user/create_org",{orgName,user_id:localStorage.getItem("user_id")});
    console.log(response);
    closeModal();
  };

  const handleTeamSubmit = async(e) => {
    e.preventDefault();
    // console.log("Creating Team:", teamName, "Under Org:", teamOrg);
    let response= await axios.post("https://full-stack-intership-assignment.onrender.com/user/create_dept",{DeptName:teamName,org_id:teamOrg});
    console.log(response.data);
    closeModal();
  };

const get_user_org = async () => {
  try {
    const response = await axios.get(
      `https://full-stack-intership-assignment.onrender.com/user/get_org?user_id=${localStorage.getItem("user_id")}`
    );

    if (response.data.status === "success") {
      console.log(response.data);
      setOrganizations(response.data.data); 
    } else {
      console.error("Failed to fetch organizations:", response.data.message);
    }
  } catch (err) {
    console.error("Error fetching organizations:", err);
  }
};


const fetchDepartments = async (orgId) => {
  try {
    const response = await axios.get(`https://full-stack-intership-assignment.onrender.com/user/get_depts?org_id=${orgId}`);
    if (response.data.status === "success") {
      setDepartments(response.data.departments);  
    } else {
      console.error("Failed to fetch departments:", response.data.message);
    }
  } catch (err) {
    console.error("Error fetching departments:", err);
  }
};





  useEffect(()=>{
    get_user_org();
  },[])

  return (
    <div className="h-screen flex flex-col">
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 border-r border-gray-300 p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Organization</h2>
          <ul className="space-y-2 text-gray-700">
            {organizations.length === 0 ? (
              <li className="text-gray-500">No organizations found.</li>
            ) : (
              organizations.map((org) => (
                <li
                  key={org.id}
                  className={`hover:bg-gray-200 px-3 py-2 rounded cursor-pointer ${selectedOrg === org.id ? 'bg-gray-300' : ''}`}
                  onClick={() => {
                    setSelectedOrg(org.id);
                    fetchDepartments(org.id);
                  }}
                >
                  {org.name}
                </li>
              ))
            )}
          </ul>

        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 bg-white shadow relative">
            <h1 className="text-2xl font-semibold text-gray-800">Welcome to Dashboard</h1>

            <div className="relative">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Create +
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white border rounded shadow-md z-10">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
                    onClick={() => openModal("organization")}
                  >
                    Create Organization
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
                    onClick={() => openModal("team")}
                  >
                    Create Department
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="w-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition duration-300 p-5 flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{dept.name}</h3>
                    <p className="text-sm text-gray-500">
                      Department ID: {dept.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-2">
                  <button onClick={()=>window.location=`/team_board?dept_id=${dept.id}`} className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1 rounded-lg">
                    View
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-4 py-1 rounded-lg">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {modalType === "organization" ? "Create Organization" : "Create Department"}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-red-600 text-xl font-bold">
                ×
              </button>
            </div>

            {modalType === "organization" && (
              <form onSubmit={handleOrgSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Organization Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Submit
                </button>
              </form>
            )}

            {modalType === "team" && (
              <form onSubmit={handleTeamSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Department Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Select Organization</label>
                  <select
                    className="w-full px-3 py-2 border rounded"
                    value={teamOrg}
                    onChange={(e) => setTeamOrg(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select an organization</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashBoard;
