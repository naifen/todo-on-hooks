import React, { useState, useEffect, useContext, useRef } from "react";
import uuid from "uuid/v4";
import { TodoContext } from "../context";
import { todoCollectionUrl } from "../helpers";
import { useNonInitRender } from "../customHooks";

const AddTodo: React.FC = () => {
  const dispatch = useContext(TodoContext);
  const nonInitRender = useNonInitRender();
  const [task, setTask] = useState("");
  const todoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let fetchCanceled = false;
    if (nonInitRender) {
      const addTodo = async () => {
        const todo = { task: task, id: uuid(), complete: false };
        try {
          const response = await fetch(todoCollectionUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todo)
          });
          if (
            !fetchCanceled &&
            response.status >= 200 &&
            response.status < 300 &&
            response.ok
          ) {
            dispatch({ type: "ADD_TODO", payload: todo });
            todoInput.current!.value = "";
          } // TODO: handle other status code
        } catch (err) {
          console.log(err);
        }
      };
      addTodo();

      return () => {
        fetchCanceled = true;
      };
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTask(todoInput.current!.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={todoInput} type="text" />
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default AddTodo;
