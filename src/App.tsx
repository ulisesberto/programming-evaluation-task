import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Evaluation from "./evaluation";
import Header from "./commponents/header";

function App() {
  return (
    <div className="App">
      <div>
        <Header />
      </div>

      <Evaluation />
    </div>
  );
}

export default App;
