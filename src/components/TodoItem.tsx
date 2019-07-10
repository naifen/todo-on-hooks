import React, { useContext, useState, useEffect, useReducer } from "react";
import { TodoContext } from "../context";
import { TodoProps } from "../typeDefinitions";
import { todoUrl, fetchAndDispatch } from "../helpers";
import { useNonInitRender } from "../customHooks";
import fetchStatusReducer from "../reducers/fetchStatusReducer";

const TodoItem: React.FC<{ todo: TodoProps }> = ({ todo }) => {
  const dispatch = useContext(TodoContext);
  const nonInitRender = useNonInitRender();
  const [todoComplete, setTodoComplete] = useState(todo.complete);
  const [fetchStatus, dispatchFetchStatus] = useReducer(fetchStatusReducer, {
    isLoading: false,
    isError: false
  });

  useEffect(() => {
    let fetchCanceled = false;
    if (nonInitRender) {
      const data = { ...todo, complete: todoComplete };
      const updateTodo = fetchAndDispatch(
        { endpoint: todoUrl(todo.id), method: "PUT", data: data },
        { statusDispatch: dispatchFetchStatus, cancelFlag: fetchCanceled },
        {
          dispatch: dispatch,
          action: {
            type: todo.complete ? "UNDO_TODO" : "DO_TODO",
            payload: { id: todo.id }
          },
          asyncData: false
        }
      );
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
        {todo.task} {fetchStatus.isLoading && <span>Updating...</span>}{" "}
        {fetchStatus.isError && (
          <span>An error has occurred, please try again....</span>
        )}
      </label>
    </li>
  );
};

export default TodoItem;
