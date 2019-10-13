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
    if (nonInitRender) {
      const data = { ...todo, complete: todoComplete };
      const { makeRequest, setFetchCancellation } = fetchAndDispatch(
        { dispatch: dispatchFetchStatus },
        {
          dispatch: dispatch,
          action: {
            type: todo.complete ? "UNDO_TODO" : "DO_TODO",
            payload: { id: todo.id }
          },
          isAsyncData: false
        }
      );
      makeRequest({ endpoint: todoUrl(todo.id), method: "PUT", data: data });

      return () => {
        setFetchCancellation(true);
      };
    }
  }, [todoComplete]);
  // FIXME:
  // Warning: React Hook useEffect has missing dependencies: 'dispatch',
  //'nonInitRender', and 'todo'. Either include them or remove the dependency
  // array  react-hooks/exhaustive-deps

  // TODO: remove and update todo content inline
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
