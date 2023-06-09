import React from 'react';
import './App.css';
import Login from "./Pages/Login";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HotelsPage from "./Pages/Hotels";

function App() {

    return (
        <BrowserRouter>
        <div className="App">
            <header className="App-header">
            </header>
            <Routes>
                <Route path='*' element={<Login />} />
                <Route path="/hotels" element={<HotelsPage />} />
            </Routes>
        </div>
        </BrowserRouter>
    );
}

export default App;
