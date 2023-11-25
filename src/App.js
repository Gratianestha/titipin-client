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
import Content from './pages/Content.jsx';
import DetailJob from './pages/DetailJob.jsx';
import TopBar from './components/TopBar.jsx';

export const context = createContext()

function App() {

  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('loggedIn') ? localStorage.getItem('loggedIn') : "")

  return (
    <div className='App overflow-x-hidden'>
    <context.Provider value={[loggedInUser, setLoggedInUser]}>
    <Router>
        <TopBar/>

        <div className='flex-1 min-h-screen w-screen overflow-x-hidden'>
            <Routes>
                <Route path="/home" element={<Content currentPage={"home"} />} />
                <Route path="/addjob" element={<AddJob />} />
                <Route path="/history" element={<Content currentPage={"history"} />} />
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/job/:jobId" element={<DetailJob />} />       
            </Routes>
        </div>
            <NavBar/>
    </Router>
    </context.Provider>    
      </div>
  );
}

export default App;
