import React, { useContext } from "react";
import { TodoContext } from "../context";
import { TodoProps } from "../typeDefinitions";

const TodoItem: React.FC<{ todo: TodoProps }> = ({ todo }) => {
  const dispatch = useContext(TodoContext);
  const handleChange = () => {
    dispatch({
      type: todo.complete ? "UNDO_TODO" : "DO_TODO",
      id: todo.id
    });
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
