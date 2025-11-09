// client/src/context/DataContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import api, { TaskAPI, NoteAPI } from '../services/api';

const DataContext = createContext();
export const useData = () => useContext(DataContext);

export function DataProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [t, n] = await Promise.all([TaskAPI.list(), NoteAPI.list()]);
      setTasks(Array.isArray(t) ? t : []);
      setNotes(Array.isArray(n) ? n : []);
    } catch (e) {
      console.error('loadAll error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  // convenience actions that update state locally + call API
  const actions = {
    async addTask(payload) { const t = await TaskAPI.create(payload); setTasks(prev => [t, ...prev]); return t; },
    async updateTask(id, payload) { const t = await TaskAPI.update(id, payload); setTasks(prev => prev.map(p => p._id === id ? t : p)); return t; },
    async toggleTask(id) { const t = await TaskAPI.toggle(id); setTasks(prev => prev.map(p => p._id === id ? t : p)); return t; },
    async removeTask(id) { await TaskAPI.remove(id); setTasks(prev => prev.filter(p => p._id !== id)); },

    async addNote(payload) { const n = await NoteAPI.create(payload); setNotes(prev => [n, ...prev]); return n; },
    async updateNote(id, payload) { const n = await NoteAPI.update(id, payload); setNotes(prev => prev.map(x => x._id === id ? n : x)); return n; },
    async removeNote(id) { await NoteAPI.remove(id); setNotes(prev => prev.filter(x => x._id !== id)); },

    reload: loadAll
  };

  return (
    <DataContext.Provider value={{ tasks, notes, loading, ...actions }}>
      {children}
    </DataContext.Provider>
  );
}
