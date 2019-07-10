import React, { useContext, useState, useEffect, useReducer } from "react";
import { TodoContext } from "../context";
import { TodoProps } from "../typeDefinitions";
import { todoUrl } from "../helpers";
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
      const updateTodo = async () => {
        dispatchFetchStatus({ type: "FETCH_INIT" });
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
            dispatchFetchStatus({ type: "FETCH_SUCCESS" });
            dispatch({
              type: todo.complete ? "UNDO_TODO" : "DO_TODO",
              id: todo.id
            });
          } else {
            dispatchFetchStatus({ type: "FETCH_FAILURE" });
          }
        } catch (err) {
          console.log(err);
          dispatchFetchStatus({ type: "FETCH_FAILURE" });
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
        {todo.task} {fetchStatus.isLoading && <span>Updating...</span>}{" "}
        {fetchStatus.isError && (
          <span>An error has occurred, please try again....</span>
        )}
      </label>
    </li>
  );
};

export default TodoItem;
