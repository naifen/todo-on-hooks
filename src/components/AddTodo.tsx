import React, { useState, useContext } from "react";
import { TodoContext } from "../context";

const AddTodo: React.FC = () => {
  const dispatch = useContext(TodoContext);
  const [task, setTask] = useState("");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (task) dispatch({ type: "ADD_TODO", task });
    setTask("");
    event.preventDefault();
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
