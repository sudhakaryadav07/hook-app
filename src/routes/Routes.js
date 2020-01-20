import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { SignInComponent,} from '../screen';

var createBrowserHistory = require("history").createBrowserHistory;
const history = createBrowserHistory();

function PublicRoutes() {
console.log("rgiuhfihgit")
    // let { token } = this.props.aStore;
    return (
      <Router history={history}>
           <Route exact path="/" component={SignInComponent} />
  
      </Router>
    )
}

export default PublicRoutes;