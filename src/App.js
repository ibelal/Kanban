import React, { useEffect, useState } from "react";

import "./App.css";
import Board from "./Components/Board/Board";
import Editable from "./Components/Editabled/Editable";

import initialData from "./Data/initialData.json";

function App() {
  const [boards, setBoards] = useState(
    JSON.parse(localStorage.getItem("kanban")) || initialData
  );

  const [targetCard, setTargetCard] = useState({
    bid: "",
    cid: "",
  });

  useEffect(() => {
    // run api to fetch data and store in localstorage
    localStorage.setItem("kanban", JSON.stringify(boards));
  }, [boards]);

  const addboardHandler = (name) => {
    const tempBoards = [...boards];
    tempBoards.push({
      id: Date.now() + Math.random() * 2,
      title: name,
      cards: [],
    });
    setBoards(tempBoards);
  };

  const removeBoard = (id) => {
    const index = boards.findIndex((item) => item.id === id);
    if (index < 0) return;

    const tempBoards = [...boards];
    tempBoards.splice(index, 1);
    setBoards(tempBoards);
  };

  const addCardHandler = (id, title) => {
    const index = boards.findIndex((item) => item.id === id);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cardData = {
      id: Date.now() + Math.random() * 2,
      title,
      labels: [],
      tasks: [],
    };
    tempBoards[index].cards.push(cardData);
    setBoards(tempBoards);
    // api to add card
    console.log("new card added", cardData);
  };

  const removeCard = (bid, cid) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    cards.splice(cardIndex, 1);
    setBoards(tempBoards);
    // api to remove card
    console.log("remove card", bid, cid);
  };

  const updateCard = (bid, cid, card) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].cards[cardIndex] = card;

    setBoards(tempBoards);
    // api to update card
    console.log("update card", bid, cid, card);
  };

  const dragEnded = (bid, cid) => {
    let source_boardIndex,
      source_cardIndex,
      target_boardIndex,
      target_cardIndex;
    source_boardIndex = boards.findIndex((item) => item.id === bid);
    if (source_boardIndex < 0) return;

    source_cardIndex = boards[source_boardIndex]?.cards?.findIndex(
      (item) => item.id === cid
    );
    if (source_cardIndex < 0) return;

    target_boardIndex = boards.findIndex((item) => item.id === targetCard.bid);
    if (target_boardIndex < 0) return;

    target_cardIndex = boards[target_boardIndex]?.cards?.findIndex(
      (item) => item.id === targetCard.cid
    );
    if (target_cardIndex < 0) return;

    const tempBoards = [...boards];
    const sourceCard = tempBoards[source_boardIndex].cards[source_cardIndex];
    tempBoards[source_boardIndex].cards.splice(source_cardIndex, 1);
    tempBoards[target_boardIndex].cards.splice(target_cardIndex, 0, sourceCard);
    setBoards(tempBoards);

    setTargetCard({
      bid: "",
      cid: "",
    });
  };

  const dragEntered = (bid, cid) => {
    if (targetCard.cid === cid) return;
    setTargetCard({
      bid,
      cid,
    });
  };

  return (
    <div className="app">
      <div className="app_nav">
        <h1>Kanban Board</h1>
      </div>
      <div className="app_boards">
        {boards.map((item) => (
          <Board
            key={item.id}
            board={item}
            removeBoard={() => removeBoard(item.id)}
            addCard={addCardHandler}
            removeCard={removeCard}
            updateCard={updateCard}
            dragEnded={dragEnded}
            dragEntered={dragEntered}
          />
        ))}
        <div className="app_boards_last">
          <Editable
            displayClass="app_boards_add-board"
            editClass="app_boards_add-board_edit"
            placeholder="Enter Board Name"
            text="Add Board"
            buttonText="Add Board"
            onSubmit={addboardHandler}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
