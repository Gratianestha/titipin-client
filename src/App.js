import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import AddJob from './pages/AddJob';
import Home from './pages/Home';
import History from './pages/History';
import NavBar from './components/NavBar.jsx'
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { createContext, useState } from 'react';

export const context = createContext()

function App() {

  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('loggedIn') ? localStorage.getItem('loggedIn') : "")

  return (
    <Router>
      <div className='min-h-screen'>

        <div className='flex-1 h-full'>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/addjob" element={<AddJob />} />
                <Route path="/history" element={<History />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
            </Routes>
        </div>
            <NavBar/>
      </div>
      </Router>
  );
}

export default App;
