import React, { Component } from "react";
import "./PlayersForm.css";
import {
  setDataInLS,
  getDataFromLS,
  removeDataFromLS,
} from "../../helpers/Utils";
import {
  HISTORY_SCORES,
  PLAYERS,
  NO_OF_PLAYERS,
  GAME_SCORE,
  MAX_SCORE,
  GAME_OVER,
} from "../../helpers/Constants";
import html2canvas from "html2canvas";
import ScoresHisotry from "./ScoresHistory";

class PlayersForm extends Component {
  rejoined = false;
  constructor(props) {
    super(props);
    this.state = {
      noOfPlayers: 0,
      gameScore: 0,
      maxScore: 0,
      isStart: false,
      scoresHistory: [],
      players: [],
      isGameOver: false,
    };
  }

  componentDidMount() {
    const players = getDataFromLS(PLAYERS);
    if (players) {
      const noOfPlayers = getDataFromLS(NO_OF_PLAYERS);
      const scoresHistory = getDataFromLS(HISTORY_SCORES);
      const gameScore = getDataFromLS(GAME_SCORE);
      const maxScore = getDataFromLS(MAX_SCORE);
      const isGameOver = getDataFromLS(GAME_OVER);
      this.setState({
        players,
        scoresHistory,
        noOfPlayers,
        maxScore,
        gameScore,
        isStart: true,
        isGameOver,
      });
    }
  }

  handleStartGame = () => {
    setDataInLS(PLAYERS, JSON.stringify(this.state.players));
    setDataInLS(HISTORY_SCORES, JSON.stringify(this.state.scoresHistory));
    setDataInLS(NO_OF_PLAYERS, this.state.noOfPlayers);
    setDataInLS(GAME_SCORE, this.state.gameScore);
    setDataInLS(MAX_SCORE, this.state.maxScore);
    setDataInLS(GAME_OVER, this.state.isGameOver);
    this.setState({
      isStart: true,
    });
  };

  initializeData = () => {
    const players = [];
    for (let i = 0; i < this.state.noOfPlayers; i++) {
      players.push({ name: "", score: 0, totalScore: 0 });
    }
    this.setState({
      players,
    });
  };

  handleNoOfPlayersChange = (event) => {
    const { name, value } = event.target;
    this.setState(
      {
        [name]: value,
      },
      () => this.initializeData()
    );
  };

  handleChange = (index, event) => {
    const players = [...this.state.players];
    const { name, value } = event.target;
    players[index][name] = value;
    this.setState({
      players,
    });
  };

  handleAddScore = () => {
    this.rejoined = false;
    const players = [...this.state.players];
    const scoresHistory = [...this.state.scoresHistory];
    const currentScores = {};
    let player = undefined;
    let isMaxScoreExceeded = false;
    for (let i = 0; i < players.length; i++) {
      player = players[i];
      if (Number(player.score) > this.state.maxScore) {
        isMaxScoreExceeded = true;
        alert(`Please check the scores entered for ${player.name}`);
        return;
      }
    }
    if (!isMaxScoreExceeded) {
      for (let i = 0; i < players.length; i++) {
        player = players[i];
        player.totalScore = Number(player.totalScore) + Number(player.score);
        currentScores[player.name] = player.score;
        player.score = 0;
        players[i] = player;
      }
      scoresHistory.push(currentScores);
      this.setState(
        {
          scoresHistory,
          players,
        },
        () => this.takeScreenShot(scoresHistory)
      );
      setDataInLS(HISTORY_SCORES, JSON.stringify(scoresHistory));
      setDataInLS(PLAYERS, JSON.stringify(players));
    }
  };

  takeScreenShot = (scoresHistory) => {
    html2canvas(document.body).then(function (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `cards_game_score_${scoresHistory.length}`;
      document.body.appendChild(link);
      link.click();
    });
  };

  handleEndGame = () => {
    let isConfirm = window.confirm(
      "Are you sure!! Do you want to end the Game?"
    );
    if (isConfirm) {
      setDataInLS(GAME_OVER, true);
      this.setState({
        isGameOver: true,
      });
    }
  };

  handleStartNewGame = () => {
    removeDataFromLS(GAME_OVER);
    removeDataFromLS(MAX_SCORE);
    removeDataFromLS(NO_OF_PLAYERS);
    removeDataFromLS(PLAYERS);
    removeDataFromLS(HISTORY_SCORES);
    removeDataFromLS(GAME_SCORE);
    window.location.href = "/";
  };

  handleShare = () => {
    let scoresData = "";
    for (let i = 0; i < this.state.noOfPlayers; i++) {
      scoresData += `${this.state.players[i].name}: ${this.state.players[i].totalScore},  `;
    }
    if (navigator.share) {
      navigator
        .share({
          title: "Cards Game Score",
          text: scoresData,
          url: "https://ihc-championship.firebaseapp.com/",
        })
        .then(() => window.alert("Sharing scores successful."))
        .catch((error) => window.alert("Failed to share scores: ", error));
    }
  };

  getMaxScore = () => {
    const totalScores = [];
    this.state.players.filter((ele) => {
      if (ele.totalScore < 500) {
        totalScores.push(ele.totalScore);
      }
    });
    return Math.max(...totalScores);
  };

  handleRejoin = (player, selectedIndex) => {
    const isConfirm = window.confirm(
      `Are you sure!! Do you want to rejoin ${player.name} into the Game?`
    );
    const players = [...this.state.players];
    if (isConfirm) {
      const maxScore = this.getMaxScore();
      if (this.rejoined === false) {
        players[selectedIndex].totalScore = Number(maxScore) + 1;
        this.rejoined = true;
      } else {
        players[selectedIndex].totalScore = Number(maxScore);
      }
      const scoresHistory = [...this.state.scoresHistory];
      scoresHistory.forEach((ele) => {
        ele[player.name] = 0;
      });
      setDataInLS(HISTORY_SCORES, JSON.stringify(scoresHistory));
      setDataInLS(PLAYERS, JSON.stringify(players));
      this.setState({
        scoresHistory,
        players,
      });
    }
  };

  render() {
    const {
      noOfPlayers,
      gameScore,
      players,
      isStart,
      maxScore,
      scoresHistory,
      isGameOver,
    } = this.state;
    const scoreLevel = gameScore - maxScore;
    return (
      <div>
        <React.Fragment>
          <div className="palyer-meta-form">
            <div>
              <p>Enter No. Of Players</p>
              <input
                type="number"
                className="player-name-input"
                disabled={isStart}
                name="noOfPlayers"
                value={noOfPlayers}
                onChange={this.handleNoOfPlayersChange}
              />
            </div>
            <div>
              <p>Enter Game Score</p>
              <input
                type="number"
                className="player-name-input"
                disabled={isStart}
                name="gameScore"
                value={gameScore}
                onChange={this.handleNoOfPlayersChange}
              />
            </div>
            <div>
              <p>Enter Max Score</p>
              <input
                type="number"
                className="player-name-input"
                disabled={isStart}
                name="maxScore"
                value={maxScore}
                onChange={this.handleNoOfPlayersChange}
              />
            </div>
          </div>
          {noOfPlayers > 0 && (
            <React.Fragment>
              <p>Enter Player Details</p>
              <div className="palyer-form">
                {players.map((player, index) => (
                  <div key={index}>
                    <input
                      disabled={isStart}
                      placeholder="Player Name"
                      className="player-name-input"
                      type="text"
                      name="name"
                      value={player.name}
                      onChange={(event) => this.handleChange(index, event)}
                    />
                    <div>
                      <p
                        className={`total-score ${
                          player.totalScore > scoreLevel &&
                          player.totalScore <= gameScore - 1
                            ? "above-400"
                            : player.totalScore >= gameScore
                            ? "out-of-game"
                            : ""
                        }`}
                      >
                        {player.totalScore}
                      </p>
                      {player.totalScore >= gameScore && (
                        <button
                          className="rejoin-btn"
                          onClick={() => this.handleRejoin(player, index)}
                        >
                          Rejoin
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {!isStart && (
                <div>
                  <button
                    disabled={isStart}
                    className="start_game_btn"
                    onClick={this.handleStartGame}
                  >
                    Start Game
                  </button>
                </div>
              )}
            </React.Fragment>
          )}
        </React.Fragment>
        {isStart && (
          <React.Fragment>
            <div className="player-share">
              <p>Enter Player Scores</p>
              <button className="share-btn" onClick={this.handleShare}>
                Share
              </button>
            </div>
            <div className="palyer-form">
              {players.map((player, index) => (
                <input
                  key={index}
                  placeholder="Player Score"
                  className="player-name-input"
                  type="number"
                  name="score"
                  max="80"
                  disabled={player.totalScore >= gameScore}
                  value={player.score}
                  onChange={(event) => this.handleChange(index, event)}
                />
              ))}
              <button
                disabled={isGameOver}
                className={`add_row_btn ${
                  isGameOver ? "game-over-disabled" : ""
                }`}
                onClick={this.handleAddScore}
              >
                Add Score
              </button>
            </div>
            <ScoresHisotry players={players} scoresHistory={scoresHistory} />
          </React.Fragment>
        )}
        <div>
          {isGameOver === false && isStart === true && (
            <button className="end-game-btn" onClick={this.handleEndGame}>
              End Game
            </button>
          )}
          {isGameOver === true && isStart === true && (
            <button
              className="start-new-game-btn"
              onClick={this.handleStartNewGame}
            >
              Start New Game
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default PlayersForm;
