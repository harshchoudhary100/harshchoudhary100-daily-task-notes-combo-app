import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaTasks, FaStickyNote, FaUser, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "./context/ThemeContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TasksPage from "./pages/TasksPage";
import NotesPage from "./pages/NotesPage";
import ProfilePage from "./pages/Profile";
import api from "./services/api";

function Protected({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { theme, toggle } = useTheme();
  const [taskCount, setTaskCount] = useState(0);
  const [noteCount, setNoteCount] = useState(0);

  useEffect(() => {
    // quick count loader (works both demo & real)
    const load = async () => {
      try {
        const t = await api.get("/tasks").then(r => r.data).catch(()=>[]);
        const n = await api.get("/notes").then(r => r.data).catch(()=>[]);
        setTaskCount(Array.isArray(t) ? t.length : 0);
        setNoteCount(Array.isArray(n) ? n.length : 0);
      } catch {}
    };
    load();
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, []);

  const logout = (e) => {
    e.preventDefault();
    try { api.post('/auth/logout').catch(()=>{}); } catch {}
    localStorage.clear();
    window.location.href = "/login";
  };

  const user = (() => { try { return JSON.parse(localStorage.getItem('user')||'null') } catch { return null } })();

  return (
    <>
      <nav>
        <div className="brand">
          <div className="avatar" title={user?.name || 'User'}>
            {user?.avatar ? <img src={user.avatar} alt="a" style={{width:40, height:40, objectFit:'cover'}} /> : (user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>Daily — Tasks & Notes</div>
        </div>

        <div className="nav-links">
          <NavLink to="/tasks" className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>
            <FaTasks /> Tasks {taskCount > 0 && <span style={{marginLeft:6}} className="badge">{taskCount}</span>}
          </NavLink>

          <NavLink to="/notes" className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>
            <FaStickyNote /> Notes {noteCount > 0 && <span style={{marginLeft:6}} className="badge">{noteCount}</span>}
          </NavLink>

          <NavLink to="/profile" className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>
            <FaUser /> Profile
          </NavLink>

          <button className="icon-btn" onClick={toggle} title="Toggle theme" aria-label="Toggle theme">
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>

          <button className="btn secondary" onClick={logout}>Logout</button>
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<Protected><TasksPage /></Protected>} />
        <Route path="/notes" element={<Protected><NotesPage /></Protected>} />
        <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </>
  );
}
