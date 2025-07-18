import { useState } from 'react';
import axios from "axios";
import FullScreenLoader from '../components/Loader'; 

function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); 
  const [loading, setLoading] = useState(false);  

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const endpoint = isLogin
        ? "https://full-stack-intership-assignment.onrender.com/user/login"
        : "https://full-stack-intership-assignment.onrender.com/user/signin";

      const payload = isLogin
        ? { email, password }
        : { email, name, password };

      const res = await axios.post(endpoint, payload);
      console.log(res.data);
      localStorage.setItem("token", res.data.user.token);
      localStorage.setItem("user_id", res.data.user.id);
      localStorage.setItem("user_name", res.data.user.full_name);
      localStorage.setItem("email", res.data.user.email);
      window.location = "/dashboard";
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
      {loading && <FullScreenLoader />}

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200 z-10">
        <div className="flex mb-6 border-b border-gray-300">
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 text-center rounded-t-md font-semibold transition 
              ${!isLogin ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"}`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 text-center rounded-t-md font-semibold transition 
              ${isLogin ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"}`}
          >
            Log In
          </button>
        </div>

        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          {isLogin ? "Welcome Back!" : "Create Your Account"}
        </h2>

        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          {isLogin ? "Login using email: example@gmail.com   password: 2003 " : ""}
        </h2>       

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {!isLogin && (
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
