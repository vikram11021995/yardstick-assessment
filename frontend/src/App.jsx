import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './pages/Login.js';
import Notes from "./pages/Notes.js";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </BrowserRouter>
  );
}
