import React, { useContext, useState, useEffect, useReducer } from "react";
import { TodoContext } from "../context";
import { TodoProps } from "../typeDefinitions";
import { todoUrl, createFetchAndStateHandlers } from "../helpers";
import { useInitialRender } from "../customHooks";
import fetchStatusReducer from "../reducers/fetchStatusReducer";

const TodoItem: React.FC<{ todo: TodoProps }> = ({ todo }) => {
  const dispatchTodo = useContext(TodoContext);
  const initialRender = useInitialRender();
  const [todoComplete, setTodoComplete] = useState(todo.complete);
  const [fetchStatus, dispatchFetchStatus] = useReducer(fetchStatusReducer, {
    isLoading: false,
    isError: false
  });

  // b/c the todo property is an object and JS see it as a new one every time TodoItem
  // receive props which triggers re-render and useEffect hook trigger which causes
  // data fetch, the useInitialRender custom hook is to prevent this from happening
  useEffect(() => {
    if (!initialRender) {
      const data = { ...todo, complete: todoComplete };
      const {
        fetchAndDispatch,
        setFetchCancellation
      } = createFetchAndStateHandlers(
        { dispatch: dispatchFetchStatus },
        {
          dispatch: dispatchTodo,
          action: {
            type: todo.complete ? "UNDO_TODO" : "DO_TODO",
            payload: { id: todo.id }
          },
          isAsyncData: false
        }
      );
      fetchAndDispatch({
        endpoint: todoUrl(todo.id),
        method: "PUT",
        data: data
      });

      return () => {
        setFetchCancellation(true);
      };
    }
  }, [todoComplete]);
  // FIXME:
  // Warning: React Hook useEffect has missing dependencies: 'dispatch',
  //'initialRender', and 'todo'. Either include them or remove the dependency
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
