import { useEffect, useState } from "react";
import { TaskAPI } from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const t = await TaskAPI.list();
        setTasks(t);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="container">
      <h2 style={{ margin: "10px 0" }}>🧩 My Tasks</h2>
      <TaskForm onCreated={(t) => setTasks((p) => [t, ...p])} />
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );
}
