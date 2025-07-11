import { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import React from "react";
import { faEdit, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Login from "./Login";

function TodoHome() {
  const [tasks, setTasks] = useState([]);
  const [checkedState, setCheckedState] = useState({});
  const [inputData, setInputData] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [login, setLogin] = useState(() => !!localStorage.getItem("userId"));
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputData) return;

    try {
      await axios.post("https://todo-backend-r4rx.onrender.com/tasks", {
        task: inputData,
        userId: userId,
      });

      setInputData("");
      await getAllTasks();
    } catch (e) {
      console.error("Error submitting task:", e);
    }
  };

  const getAllTasks = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const res = await axios.get(`https://todo-backend-r4rx.onrender.com/tasks/user/${userId}`);
      setTasks([...res.data]);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (index, id) => {
    setCheckedState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://todo-backend-r4rx.onrender.com/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (e) {
      console.error("Error deleting task:", e);
    }
  };

  const handleEditClick = (task) => {
    if (editingTask === task._id) {
      setEditingTask(null);
      setEditInput("");
    } else {
      setEditingTask(task._id);
      setEditInput(task.task);
    }
  };

  const handleEditSave = async (id) => {
    try {
      await axios.patch(`https://todo-backend-r4rx.onrender.com/tasks/${id}`, {
        task: editInput,
      });

      setEditingTask(null);
      setEditInput("");
      await getAllTasks();
    } catch (e) {
      console.error("Error saving edited task:", e);
    }
  };

  const saveToLocalStorage = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  useEffect(() => {
    if (login) {
      getAllTasks();
    }
  }, [login]);

  useEffect(() => {
    saveToLocalStorage(tasks);
  }, [tasks]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      {login ? (
        <div className="font-serif max-w-6xl mx-auto px-4 pb-10">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 mb-8">
            <h1 className="text-blue-300 text-2xl font-bold mb-4 sm:mb-0">
              Welcome, {userName} 👋
            </h1>
            <button
              onClick={() => {
                localStorage.clear();
                setTasks([]);
                setLogin(false);
              }}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>

          {/* Main Content */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
            <h1 className="text-blue-300 text-3xl md:text-4xl font-bold text-center mb-2">
              Todo App
            </h1>
            <h2 className="text-blue-200 text-lg text-center mb-8">
              Organize your tasks efficiently
            </h2>

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row justify-center gap-2 max-w-2xl mx-auto mb-12"
            >
              <input
                className="flex-grow h-14 border border-blue-500 bg-white/20 text-white placeholder-blue-200 rounded-xl text-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Add a new task..."
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
              />
              <button
                className="bg-blue-700 hover:bg-blue-600 h-14 px-6 rounded-xl text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-700/30"
                type="submit"
              >
                Add
              </button>
            </form>

            {/* Tasks Header */}
            <div className="flex justify-center mb-8">
              <div className="bg-blue-700 py-4 px-8 rounded-full">
                <h1 className="text-xl md:text-2xl font-bold">
                  Your Tasks List
                </h1>
              </div>
            </div>

            {/* Loading/Empty States */}
            {loading && (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p>Loading your tasks...</p>
              </div>
            )}

            {!loading && tasks.length === 0 && (
              <div className="text-center py-10 bg-blue-800/30 rounded-2xl">
                <p className="text-lg text-blue-200">
                  No tasks found. Add your first task to get started!
                </p>
              </div>
            )}

            {/* Tasks Grid */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-gradient-to-br from-blue-800/40 to-blue-900/50 rounded-2xl p-5 flex flex-col border border-blue-700/30 shadow-lg hover:shadow-blue-700/30 transition-all duration-300"
                >
                  <div className="flex items-start mb-3">
                    <input
                      type="checkbox"
                      className="mt-1 w-5 h-5 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      checked={!!checkedState[task._id]}
                      onChange={() => handleCheckboxChange(task._id)}
                    />
                    
                    <div className="ml-3 flex-1 min-w-0">
                      {editingTask === task._id ? (
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            className="w-full px-3 py-2 rounded-lg bg-blue-900/50 text-white border border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={editInput}
                            onChange={(e) => setEditInput(e.target.value)}
                            autoFocus
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              className="px-3 py-1 text-sm rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors"
                              onClick={() => setEditingTask(null)}
                            >
                              Cancel
                            </button>
                            <button
                              className="px-3 py-1 text-sm rounded-lg bg-blue-700 hover:bg-blue-600 transition-colors"
                              onClick={() => handleEditSave(task._id)}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <h3 
                          className={`break-words text-lg ${checkedState[task._id] ? 'line-through text-blue-300' : 'text-white'}`}
                        >
                          {task.task}
                        </h3>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 mt-auto pt-3 border-t border-blue-700/30">
                    <button
                      className="p-2 rounded-full hover:bg-blue-700/30 transition-colors"
                      onClick={() => handleEditClick(task)}
                      aria-label={editingTask === task._id ? "Cancel" : "Edit"}
                    >
                      <FontAwesomeIcon 
                        icon={editingTask === task._id ? faTimes : faEdit} 
                        className={editingTask === task._id ? "text-yellow-400" : "text-blue-300"}
                      />
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-red-500/30 transition-colors"
                      onClick={() => handleDelete(task._id)}
                      aria-label="Delete"
                    >
                      <FontAwesomeIcon 
                        icon={faTrash} 
                        className="text-red-400" 
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Login setLogin={setLogin} />
      )}
    </div>
  );
}

export default TodoHome;