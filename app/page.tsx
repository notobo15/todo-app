"use client";
import { Todo } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";

const App = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editIndex, setEditIndex] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("all");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    // Check if the user is not authenticated
    if (!storedUser) {
      toast.warn("Bạn cần đăng nhập trước khi truy cập trang này.", {
        position: "top-center",
        autoClose: 1000,
      });
      // Redirect to the login page after the toast displays
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      return;
    }

    // Set user email if authenticated
    const user = JSON.parse(storedUser);
    setUserEmail(user.email);
    fetchTodos(); // Fetch todos on component mount
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todo", {
        method: "GET",
        credentials: "include", // Include cookies in the request
      });

      if (response.status === 401) {
        // If unauthorized, redirect to login
        router.push("/login");
        return;
      }

      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  const handleClick = async () => {
    if (todo.trim() === "") return;

    if (isEditing && editIndex !== null) {
      // Update existing todo
      const updatedTodo = { todo };
      await fetch(`/api/todo/${editIndex}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTodo),
      });

      setTodos((prevTodos) =>
        prevTodos.map((item) =>
          item.id === editIndex ? { ...item, todo } : item
        )
      );

      setIsEditing(false);
      setEditIndex(null);
    } else {
      // Add new todo
      const response = await fetch("/api/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo }),
      });
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
    }

    setTodo("");
    inputRef.current?.focus();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/todo/${id}`, { method: "DELETE" });
    setTodos(todos.filter((item) => item.id !== id));
  };

  const handleEdit = (id: string) => {
    const selectedTodo = todos.find((item) => item.id === id);
    if (selectedTodo && !selectedTodo.isCompleted) {
      setTodo(selectedTodo.todo);
      setIsEditing(true);
      setEditIndex(id);
      inputRef.current?.focus();
    }
  };

  const handleComplete = async (id: string) => {
    const todo = todos.find((item) => item.id === id);
    if (todo) {
      await fetch(`/api/todo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !todo.isCompleted }),
      });

      setTodos(
        todos.map((item) =>
          item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
        )
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.isCompleted;
    if (filter === "todo") return !todo.isCompleted;
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");

    document.cookie =
      "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    router.push("/login");
  };
  return (
    <div className="bg-slate-50">
      <header className="bg-gray-50 text-white px-6 py-4 shadow-md flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-400">To Do List</h2>
        <div className="flex items-center space-x-4">
          {userEmail && (
            <span className="text-gray-500 italic">
              Hello, <b>{userEmail}</b>
            </span>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 rounded-lg text-white font-semibold hover:bg-red-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </header>
      <div className="p-6 max-w-2xl mx-auto mt-5 border-gray-900 bg-white rounded-xl shadow-md space-y-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800">To Do</h2>

        <div className="flex items-center justify-center space-x-2 mb-4">
          <input
            ref={inputRef}
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            onKeyDown={handleKeyDown} // Listen for Enter key
            type="text"
            placeholder="Add a task"
            className="border border-gray-300 p-2 rounded w-2/3 text-gray-700 focus:outline-none focus:border-blue-400"
          />
          <button
            onClick={handleClick}
            className={`flex items-center justify-center space-x-2 ${
              isEditing
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white font-semibold px-4 py-2 rounded transition-colors duration-200`}
          >
            {isEditing ? <FiEdit /> : <AiOutlinePlus />}
            <span>{isEditing ? "Edit" : "Add"}</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center space-x-4 mb-4">
          {["all", "todo", "completed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded ${
                filter === type
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {type === "all" ? "All" : type === "todo" ? "To Do" : "Completed"}
            </button>
          ))}
        </div>

        {/* To Do List */}
        <ul className="space-y-3">
          {filteredTodos.map((item) => (
            <li
              key={item.id}
              className={`flex items-center justify-between p-4 rounded-lg shadow-md bg-gray-100 ${
                item.isCompleted
                  ? "line-through text-gray-500"
                  : "text-gray-800"
              }`}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={item.isCompleted}
                  onChange={() => handleComplete(item.id)}
                  className="form-checkbox h-5 w-5 text-green-500"
                />
                <span>{item.todo}</span>
                {!item.isCompleted && (
                  <span className="text-sm text-gray-400">
                    Created: {formatDate(item.createdDate)}
                  </span>
                )}
              </div>

              <div className="flex space-x-3">
                {!item.isCompleted && (
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                    aria-label="Edit"
                  >
                    <FiEdit />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  aria-label="Delete"
                >
                  <AiOutlineDelete />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
