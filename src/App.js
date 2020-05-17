import React from "react";
import HomePage from "./pages/HomePage";
import Header from "./components/header/Header";

function App() {
  return (
    <div>
      <Header />
      <div className="cards-game-app">
        <HomePage />
      </div>
    </div>
  );
}

export default App;
