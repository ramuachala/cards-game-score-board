import React, { Component } from "react";
import PlayersForm from "../components/home/PlayersForm";

class HomePage extends Component {
  render() {
    return (
      <div className="padding-16">
        <PlayersForm />
      </div>
    );
  }
}

export default HomePage;
