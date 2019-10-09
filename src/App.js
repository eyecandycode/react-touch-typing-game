import React, { useState, useEffect, useRef } from "react";

function App() {
  const textInputRef = useRef(null);

  const [value, setValue] = useState(0);
  //For visual representation of letters complete
  const [completed, setCompleted] = useState(0);
  //Array of words <?>
  const [words, setWords] = useState([]);
  const [wordComplete, setWordComplete] = useState(false);
  const [sentencesComplete, setSentencesComplete] = useState(0);
  //TIME
  const [startTime, setStartTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [timeStamps, setTimeStamps] = useState([]);
  //WPM
  const [wpm, setWpm] = useState(0);
  //Started
  const [started, setStarted] = useState(false);
  //Finished
  const [finished, setFinished] = useState(false);

  const data = [
    "Click below to find out how many words you can type a minute.",
    "Ice, wind and fire is all that I desire",
    "In the bleak mid-winter",
    "Do you know what it means to miss New Orleans?",
    "When I go to the forest today I hope to spy a crow",
    "Frosty wind made moan",
    `Congratulations, you typed ${wpm} words per minute.`
  ];

  let strArr = data[sentencesComplete].split("");

  useEffect(() => {
    setWords(data[sentencesComplete].split(" "));
  }, [sentencesComplete]);

  //Empty input value after word completion
  useEffect(() => {
    setWpm(
      (60 / (timeStamps[timeStamps.length - 1] / timeStamps.length)).toFixed(1)
    );
    setValue("");
  }, [wordComplete]);

  const handleChange = e => {
    setValue(e.target.value);
    if (value === words[0]) {
      setWordComplete(!wordComplete);
      words.shift();

      let timeStamp = (new Date() - startTime) / 1000;
      setTimeStamps(timeStamps => [...timeStamps, timeStamp]);
    }
    if (words.length === 0) {
      setWordComplete(!wordComplete);
      setSentencesComplete(sentencesComplete + 1);
      setCompleted(0);
    }

    //set finish point
    if (words.length === 0 && sentencesComplete === data.length - 2) {
      setFinished(true);
    }
  };

  const handlePress = e => {
    if (strArr[completed] === e.key) {
      setCompleted(completed + 1);
    }
  };

  const handleButtonClick = () => {
    setSentencesComplete(sentencesComplete + 1);
    setStarted(true);
    setStartTime(new Date() - startTime);
    setInterval(tick, 1000);
  };

  useEffect(() => {
    textInputRef.current.focus();
  }, [started]);

  const tick = () => {
    setCurrentTime(new Date());
  };

  return (
    <div className='App'>
      <div className='sentence'>
        <span className='done' style={{ color: "red" }}>
          {strArr.slice(0, completed)}
        </span>
        <span className='todo'>{strArr.slice(completed)}</span>
      </div>
      {!started ? (
        <p className='instructions'>
          Instructions: Type the sentence displayed as quick as you can, press
          spacebar to continue to next word.
        </p>
      ) : finished ? (
        ""
      ) : (
        <div className='next-letter'>{strArr[completed]}</div>
      )}

      {!started ? (
        <button
          className='start-game'
          style={{ fontSize: 30 }}
          onClick={handleButtonClick}
        >
          Start Game
        </button>
      ) : (
        ""
      )}

      {finished ? (
        ""
      ) : (
        <input
          className='type-input'
          autoFocus
          type='text'
          ref={textInputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={e => handlePress(e)}
          style={
            !started ? { visibility: "hidden" } : { visibility: "visible" }
          }
        />
      )}
      <div className='display'>
        {!started ? (
          ""
        ) : (
          <div className='timer'>
            {finished
              ? ""
              : Math.ceil((currentTime - startTime) / 1000) < 0
              ? "1"
              : Math.ceil((currentTime - startTime) / 1000)}
          </div>
        )}
        {finished ? (
          <button
            className='replay-btn'
            style={{ fontSize: 30 }}
            onClick={() => window.location.reload()}
          >
            REPLAY?
          </button>
        ) : started ? (
          <p>WPM: {wpm == "NaN" ? "0" : wpm}</p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default App;
