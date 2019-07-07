import React from "react";
import TodoItem from "./TodoItem";
import { TodoProps } from "../typeDefinitions";

const TodoList: React.FC<{ todos: TodoProps[] }> = ({ todos }) => (
  <ul>
    {todos.map((todo: TodoProps) => (
      <TodoItem key={todo.id} todo={todo} />
    ))}
  </ul>
);

export default TodoList;
