import { useEffect, useState } from "react";

function NavBar() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  function logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("user_name");
    window.location = "/";
  }

  useEffect(() => {
    setEmail(localStorage.getItem("email") || "");
    setName(localStorage.getItem("user_name") || "");
  }, []);

  return (
    <div className="w-full bg-white shadow p-4 flex items-center justify-between">
      {/* Left section: Logo & Navigation */}
      <div className="flex items-center gap-4">
        <img
          src="https://www.freepnglogos.com/uploads/spotify-logo-png/file-spotify-logo-png-4.png"
          alt="Logo"
          className="w-8 h-8"
        />
        <span className="font-semibold text-gray-800 text-lg">Dashboard</span>

        <div className="flex items-center gap-3 ml-6 text-gray-600">
          <span className="cursor-pointer hover:text-gray-800">
          </span>
        </div>
      </div>

      {/* Right section: User Info & Logout */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          {name ? `Hello, ${name}` : email}
        </span>
        <button
          onClick={logOut}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default NavBar;
