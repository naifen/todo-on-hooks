import { TodoProps, TodoAction } from "../typeDefinitions";

const todoReducer = (state: TodoProps[], action: TodoAction) => {
  switch (action.type) {
    case "DO_TODO":
      return state.map(todo => {
        if (todo.id === (action.payload as { id: string }).id) {
          return { ...todo, complete: true };
        } else {
          return todo;
        }
      });
    case "UNDO_TODO":
      return state.map(todo => {
        if (todo.id === (action.payload as { id: string }).id) {
          return { ...todo, complete: false };
        } else {
          return todo;
        }
      });
    case "ADD_TODO":
      return state.concat(action.payload as TodoProps[]);
    case "SET_TODOS":
      return action.payload as TodoProps[];
    default:
      throw new Error();
  }
};

export default todoReducer;
