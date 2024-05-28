import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Collection from './Collection';
import './App.css'

const App = () => {
    return (
        <Routes>
            <Route path='' element={<Home />} />
            <Route path='collection/:id' element={<Collection id={1} />} />
        </Routes>
    );
}

export default App;

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <App />
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);
