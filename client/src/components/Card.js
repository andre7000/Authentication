import React, { useState } from "react";
import "./Card.css";

export default function Card() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="card-container">
      <div className={`card ${isFlipped ? "flipped" : ""}`}>
        <div className="card-face card-front">
          <span className="card-number">5</span>
          <button className="flip-button" onClick={handleFlip}>
            ↻
          </button>
        </div>
        <div className="card-face card-back">
          <span className="card-back-content">★</span>
          <button className="flip-button" onClick={handleFlip}>
            ↻
          </button>
        </div>
      </div>
    </div>
  );
}
