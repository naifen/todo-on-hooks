import React, { useReducer, useEffect } from "react";
import todoReducer from "./reducers/todoReducer";
import filterReducer from "./reducers/filterReducer";
import fetchStatusReducer from "./reducers/fetchStatusReducer";
import { TodoContext } from "./context";
import Filter from "./components/Filter";
import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";
import { TodoProps } from "./typeDefinitions";
import { todoCollectionUrl, createFetchAndStateHandlers } from "./helpers";

const initialTodo: TodoProps[] = [];

const App: React.FC = () => {
  const [todos, dispatchTodos] = useReducer(todoReducer, initialTodo);
  const [filter, dispatchFilter] = useReducer(filterReducer, "ALL");
  const [fetchStatus, dispatchFetchStatus] = useReducer(fetchStatusReducer, {
    isLoading: false,
    isError: false
  });

  useEffect(() => {
    const {
      fetchAndDispatch,
      setFetchCancellation
    } = createFetchAndStateHandlers(
      { dispatch: dispatchFetchStatus },
      {
        dispatch: dispatchTodos,
        action: { type: "SET_TODOS" },
        isAsyncData: true
      }
    );
    fetchAndDispatch({ endpoint: todoCollectionUrl, method: "GET" });

    return () => {
      setFetchCancellation(true);
    };
  }, []); // only perform initial fetch on component mounted

  const filteredTodos = todos.filter((todo: TodoProps) => {
    if (filter === "ALL") return true;
    if (filter === "COMPLETE") return todo.complete;
    if (filter === "INCOMPLETE") return !todo.complete;

    return false;
  });

  return (
    <TodoContext.Provider value={dispatchTodos}>
      <Filter dispatch={dispatchFilter} />
      {fetchStatus.isError && (
        <p>An error has occurred, please refresh page and try again...</p>
      )}
      {fetchStatus.isLoading ? (
        <p>Loading...</p>
      ) : (
        <TodoList todos={filteredTodos} />
      )}
      <AddTodo />
    </TodoContext.Provider>
  );
};

export default App;
