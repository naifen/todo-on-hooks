import React, { useReducer } from "react";
import todoReducer from "./reducers/todoReducer";
import filterReducer from "./reducers/filterReducer";
import { TodoContext, initialTodos } from "./context";
import Filter from "./components/Filter";
import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";
import { TodoProps } from "./typeDefinitions";

const App = () => {
  const [filter, dispatchFilter] = useReducer(filterReducer, "ALL");
  const [todos, dispatchTodos] = useReducer(todoReducer, initialTodos);

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
