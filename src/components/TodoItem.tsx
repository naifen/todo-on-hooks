import React, { useContext, useState, useEffect } from "react";
import { TodoContext } from "../context";
import { TodoProps } from "../typeDefinitions";
import { todoUrl } from "../helpers";
import { useNonInitRender } from "../customHooks";

const TodoItem: React.FC<{ todo: TodoProps }> = ({ todo }) => {
  const dispatch = useContext(TodoContext);
  const nonInitRender = useNonInitRender();
  const [todoComplete, setTodoComplete] = useState(todo.complete);

  useEffect(() => {
    let fetchCanceled = false;
    // inspired by: https://stackoverflow.com/a/55409573/2214422
    if (nonInitRender) {
      const updateTodo = async () => {
        const data = { ...todo, complete: todoComplete };
        try {
          const response = await fetch(todoUrl(todo.id), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
          });
          if (
            !fetchCanceled &&
            response.status >= 200 &&
            response.status < 300 &&
            response.ok
          ) {
            dispatch({
              type: todo.complete ? "UNDO_TODO" : "DO_TODO",
              id: todo.id
            });
          } // TODO: handle other status code
        } catch (err) {
          console.log(err);
        }
      };
      updateTodo();

      return () => {
        fetchCanceled = true;
      };
    }
  }, [todoComplete]);

  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={todo.complete}
          onChange={() => setTodoComplete(!todo.complete)}
        />
        {todo.task}
      </label>
    </li>
  );
};

export default TodoItem;
