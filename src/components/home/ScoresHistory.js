import React from "react";

function ScoresHisotry(props) {
  return (
    props.scoresHistory.length > 0 && (
      <div>
        <p>Scores History</p>
        <div className="history-data">
          {props.scoresHistory.map((history, hi) => (
            <div key={hi}>
              {props.players.map((player, index) => (
                <input
                  key={index}
                  className="player-name-input"
                  type="number"
                  disabled
                  value={history[player.name]}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  );
}

export default ScoresHisotry;
