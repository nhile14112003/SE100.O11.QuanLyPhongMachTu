import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route

} from "react-router-dom";
import Introduction from './components/Introduction';
function App() {

  return (

    <Router>

      <Switch>
        <Route path="/doctors">
          <Introduction />
        </Route>
        <Route path="/services">
          <Introduction />
        </Route>
        <Route path="/contacts">
          <Introduction />
        </Route>
        <Route path="/booking">

        </Route>
        <Route path="/sign_in">

        </Route>
        <Route path="/sign_up">

        </Route>
        <Route path="/" exact>
          <Introduction />
        </Route>
        <Route path="*" >
          404 Not Found
        </Route>
      </Switch>
    </Router >
  );
}

export default App;
