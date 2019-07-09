import React, { useReducer, useEffect } from "react";
import todoReducer from "./reducers/todoReducer";
import filterReducer from "./reducers/filterReducer";
import { TodoContext } from "./context";
import Filter from "./components/Filter";
import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";
import { TodoProps } from "./typeDefinitions";
import { todoCollectionUrl } from "./helpers";

const initialTodo: TodoProps[] = [];

const App: React.FC = () => {
  const [todos, dispatchTodos] = useReducer(todoReducer, initialTodo);
  const [filter, dispatchFilter] = useReducer(filterReducer, "ALL");

  useEffect(() => {
    // a flag used to abort a api call if component unmounted or with AbortController:
    // https://developer.mozilla.org/en-US/docs/Web/API/AbortController
    let fetchCanceled = false;
    const fetchData = async () => {
      try {
        const response = await fetch(todoCollectionUrl);
        const result = await response.json();

        if (
          !fetchCanceled && // avoid updating state if component unmounted
          response.status >= 200 &&
          response.status < 300 &&
          response.ok
        ) {
          dispatchTodos({
            type: "SET_TODOS",
            payload: result
          });
        }
      } catch (err) {
        console.log(err); // TODO better error handling, consider a reducer
      }
    };
    fetchData();

    return () => {
      fetchCanceled = true;
    };
  }, []); // only fetch on component load

  const filteredTodos = todos.filter((todo: TodoProps) => {
    if (filter === "ALL") return true;
    if (filter === "COMPLETE") return todo.complete;
    if (filter === "INCOMPLETE") return !todo.complete;

    return false;
  });

  return (
    <TodoContext.Provider value={dispatchTodos}>
      <Filter dispatch={dispatchFilter} />
      <TodoList todos={filteredTodos} />
      <AddTodo />
    </TodoContext.Provider>
  );
};

export default App;
