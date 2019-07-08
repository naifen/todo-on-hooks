import React, { useState, useContext } from "react";
import uuid from "uuid/v4";
import { TodoContext } from "../context";
import { todoCollectionUrl } from "../helpers";

const AddTodo: React.FC = () => {
  const dispatch = useContext(TodoContext);
  const [task, setTask] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (task) {
      const todo = { task: task, id: uuid(), complete: false };
      try {
        const response = await fetch(todoCollectionUrl, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(todo) // body todo type must match "Content-Type" header
        });
        if (response.status >= 200 && response.status < 300 && response.ok) {
          dispatch({ type: "ADD_TODO", payload: todo });
          setTask("");
        } // TODO: handle other status code
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTask(event.target.value);

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={task} onChange={handleChange} />
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default AddTodo;
