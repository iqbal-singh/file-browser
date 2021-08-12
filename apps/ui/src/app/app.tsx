import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import FileBrowser from './views/FileBrowser';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="*">
          <FileBrowser />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
