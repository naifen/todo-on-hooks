import uuid from "uuid/v4";
import { TodoProps, TodoAction } from "../typeDefinitions";

const todoReducer = (state: TodoProps[], action: TodoAction) => {
  switch (action.type) {
    case "DO_TODO":
      return state.map(todo => {
        if (todo.id === action.id) {
          return { ...todo, complete: true };
        } else {
          return todo;
        }
      });
    case "UNDO_TODO":
      return state.map(todo => {
        if (todo.id === action.id) {
          return { ...todo, complete: false };
        } else {
          return todo;
        }
      });
    case "ADD_TODO":
      return state.concat({
        task: action.task,
        id: uuid(),
        complete: false
      });
    case "SET_TODOS":
      return action.payload;
    default:
      throw new Error();
  }
};

export default todoReducer;
