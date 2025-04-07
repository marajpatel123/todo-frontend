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
    <div>
      {login ? (
        <div className="font-serif">
          {/* Top Header with Welcome and Logout - Responsive */}
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 pt-4">
            <h1 className="text-white text-2xl font-bold text-center sm:text-left mb-2 sm:mb-0">
              Welcome, {userName} 👋
            </h1>
            <button
              onClick={() => {
                localStorage.clear();
                setTasks([]);
                setLogin(false);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          <h1 className="text-green-500 text-[30px] font-bold text-center mt-2">Todo App.</h1>
          <h2 className="text-white text-[20px] text-center">Add your task here..</h2>

          {/* Input for new task */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row justify-center items-center mt-4 px-4"
          >
            <input
              className="w-full sm:w-[400px] h-14 border rounded-l-lg text-black text-xl font-semibold px-4 mb-2 sm:mb-0"
              type="text"
              placeholder="Add task"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
            />
            <button
              className="bg-pink-400 h-14 w-full sm:w-[100px] rounded-r-lg text-xl text-black"
              type="submit"
            >
              Add
            </button>
          </form>

          <h1 className="text-[25px] w-auto h-[80px] shadow-inner shadow-red-400 text-yellow-400 mt-[100px] text-center content-center rounded-full">
            Tasks List
          </h1>

          {loading && (
            <p className="text-white text-center mt-4">Loading tasks...</p>
          )}

          {!loading && tasks.length === 0 && (
            <p className="text-white text-center mt-4">
              No tasks found. Add your first task!
            </p>
          )}

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
            {tasks.map((task, index) => (
              <div
                key={task._id}
                className="bg-zinc-400 text-black rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center shadow-inner shadow-black w-full"
              >
                <div className="flex items-center w-full sm:w-auto mb-2 sm:mb-0">
                  <input
                    type="checkbox"
                    className="w-5 h-5 mr-3"
                    checked={!!checkedState[task._id]}
                    onChange={() => handleCheckboxChange(index, task._id)}
                  />
                  {editingTask === task._id ? (
                    <div className="flex-grow flex items-center gap-2">
                      <input
                        type="text"
                        className="w-full px-3 py-1 rounded-full text-black"
                        value={editInput}
                        onChange={(e) => setEditInput(e.target.value)}
                      />
                      <button
                        className="bg-black text-white px-3 py-1 rounded-xl"
                        onClick={() => handleEditSave(task._id)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <h3 className="ml-3 break-words">{task.task}</h3>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <FontAwesomeIcon
                    icon={editingTask === task._id ? faTimes : faEdit}
                    className="text-white cursor-pointer"
                    onClick={() => handleEditClick(task)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-white cursor-pointer"
                    onClick={() => handleDelete(task._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Login setLogin={setLogin} />
      )}
    </div>
  );
}

export default TodoHome;
