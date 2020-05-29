import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import './App.css';
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  return (
    <div className="App">
        <Router>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/home" component={Home} />
            </Switch>
        </Router>
    </div>
  );
}

export default App;
