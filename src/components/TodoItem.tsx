import React, { useContext } from "react";
import { TodoContext } from "../context";
import { TodoProps } from "../typeDefinitions";
import { todoUrl } from "../helpers";

const TodoItem: React.FC<{ todo: TodoProps }> = ({ todo }) => {
  const dispatch = useContext(TodoContext);

  const handleChange = async () => {
    const data = { ...todo, complete: !todo.complete };
    try {
      const response = await fetch(todoUrl(todo.id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (response.status >= 200 && response.status < 300 && response.ok) {
        dispatch({
          type: todo.complete ? "UNDO_TODO" : "DO_TODO",
          id: todo.id
        });
      } // TODO: handle other status code
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={todo.complete}
          onChange={handleChange}
        />
        {todo.task}
      </label>
    </li>
  );
};

export default TodoItem;
