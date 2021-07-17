import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "./config";
import { Switch, Route } from "react-router-dom";
import Bills from "./components/Bills/Bills";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route
          path="/"
          render={() => {
            return <Bills></Bills>;
          }}
        />
      </Switch>
    </div>
  );
}

export default App;
