import { useState, useEffect } from 'react';
import axios from "axios";

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      let response = await axios.get("http://localhost:3000/todo/get_item");
      setItems(response.data.Data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async (id) => {
    await axios.delete(`http://localhost:3000/todo/delete_item/${id}`);
    getData();
  };

  const insertData = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await axios.post("http://localhost:3000/todo/add_item", { "name": input });
    setInput("");
    getData();
  };

  const summerize = async () => {
    setLoading(true);
    try {
      let response = await axios.post("http://localhost:3000/todo/summerise_todo");
      setSummary(response.data.message);
      setShowModal(true);
    } catch (error) {
      console.error("Error summarizing:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Todo App</h1>

      <form onSubmit={insertData} className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <label className="text-lg">Insert tasks:</label>
        <input
          className="px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setInput(e.target.value)}
          type="text"
          value={input}
          placeholder="Enter a task"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Add
          </button>
          <button
            type="button"
            onClick={summerize}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
          >
            Summarize
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center mb-6">
          <div className="inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-blue-300">Loading...</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {items.map((row) => (
            <ul key={row.row_id} className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded">
              <li className="text-lg">{row.name}</li>
              <button
                onClick={() => deleteData(row.row_id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
              >
                Delete
              </button>
            </ul>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg max-w-md w-full relative">
            <h2 className="text-2xl font-semibold mb-4 text-center">Summary</h2>
            <div className="text-sm text-white whitespace-pre-line">{summary}</div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
