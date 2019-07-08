import React, { useReducer, useEffect } from "react";
import todoReducer from "./reducers/todoReducer";
import filterReducer from "./reducers/filterReducer";
import { TodoContext } from "./context";
import Filter from "./components/Filter";
import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";
import { TodoProps } from "./typeDefinitions";

const url = "http://localhost:4000/todos";
const initialTodo: TodoProps[] = [];

const App: React.FC = () => {
  const [todos, dispatchTodos] = useReducer(todoReducer, initialTodo);
  const [filter, dispatchFilter] = useReducer(filterReducer, "ALL");

  // inspired by https://stackoverflow.com/a/53146965/2214422
  const fetchData = async () => {
    const response = await fetch(url);
    const result = await response.json();
    dispatchTodos({
      type: "SET_TODOS",
      payload: result
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

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
