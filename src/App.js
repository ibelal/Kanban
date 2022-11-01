import React, { useEffect, useState } from "react";

import "./App.css";
import Board from "./Components/Board/Board";
import Editable from "./Components/Editabled/Editable";

const initialData = [
  {
    id: 1667338190542.205,
    title: "To Do",
    cards: [
      {
        id: 1667338207511.9517,
        title: "Contact Form",
        labels: [{ color: "#a8193d", text: "Frontend" }],
        tasks: [
          {
            id: 1667338470630.1367,
            completed: true,
            text: "Create contact html",
          },
          {
            id: 1667338480146.6064,
            completed: false,
            text: "Create service to submit form",
          },
        ],
        createdAt: new Date(),
      },
    ],
  },
  {
    id: 1667338353904.9763,
    title: "In Progress",
    cards: [
      {
        id: 1667338197129.4885,
        title: "Listing Page",
        labels: [
          { color: "#a8193d", text: "Frontend" },
          { color: "#4fcc25", text: "Backend" },
        ],
        tasks: [
          {
            id: 1667338265484.0896,
            completed: true,
            text: "Get listing details",
          },
          {
            id: 1667338289474.3835,
            completed: false,
            text: "Create listing html",
          },
        ],
        desc: "This is listing page",
        createdAt: new Date(),
      },
    ],
  },
];

function App() {
  const [boards, setBoards] = useState(
    JSON.parse(localStorage.getItem("kanban")) || initialData
  );

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
