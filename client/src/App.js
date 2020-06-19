import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import './App.css';
import Login from "./pages/Login";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Section from "./pages/Section";
import TopBar from "./components/TopBar";
import Profile from "./pages/Profile";
import Magazine from "./pages/Magazine";
import Topic from "./pages/Topic";

function App() {
    return (
        <div className="App">
            <Router >
                <TopBar/>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/" component={Home} />
                    <Route exact path="/settings" component={Settings} />
                    <Route exact path="/profile" component={Profile} />
                    <Route exact path="/section/:id" component={Section} />
                    <Route exact path="/magazine/:id" component={Magazine} />
                    <Route exact path="/Topic/:id" component={Topic} />
                </Switch>
            </Router>
        </div>
  );
}

export default App;
