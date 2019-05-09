import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from './Login';
import Dashboard from './Dashboard';
import Users from './Users';

const App = () => {

  return (
      <Router>
          <Route path="/" exact component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/users" component={Users} />
      </Router>
  );
};

export default App;
