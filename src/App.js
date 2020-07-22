import React from 'react';
import './App.css';
import Header from './components/Header';
import {Switch, Route} from "react-router-dom";
import Home from './components/pages/Home';
import Login from './components/pages/login/Login';

function App() {
  return (
    <div className="App">
        <Header></Header>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/login" component={Login}/>
        </Switch>
    </div>
  );
}

export default App;
