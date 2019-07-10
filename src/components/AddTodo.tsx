import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useReducer
} from "react";
import uuid from "uuid/v4";
import { TodoContext } from "../context";
import { todoCollectionUrl } from "../helpers";
import { useNonInitRender } from "../customHooks";
import fetchStatusReducer from "../reducers/fetchStatusReducer";

const AddTodo: React.FC = () => {
  const dispatch = useContext(TodoContext);
  const nonInitRender = useNonInitRender();
  const [task, setTask] = useState("");
  const todoInput = useRef<HTMLInputElement>(null);
  const [fetchStatus, dispatchFetchStatus] = useReducer(fetchStatusReducer, {
    isLoading: false,
    isError: false
  });

  useEffect(() => {
    let fetchCanceled = false;
    if (nonInitRender) {
      const addTodo = async () => {
        dispatchFetchStatus({ type: "FETCH_INIT" });
        const todo = { task: task, id: uuid(), complete: false };
        try {
          const response = await fetch(todoCollectionUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todo)
          });
          if (
            !fetchCanceled &&
            response.status >= 200 &&
            response.status < 300 &&
            response.ok
          ) {
            dispatchFetchStatus({ type: "FETCH_SUCCESS" });
            dispatch({ type: "ADD_TODO", payload: todo });
            todoInput.current!.value = "";
          } else {
            dispatchFetchStatus({ type: "FETCH_FAILURE" });
          }
        } catch (err) {
          console.log(err);
          dispatchFetchStatus({ type: "FETCH_FAILURE" });
        }
      };
      addTodo();

      return () => {
        fetchCanceled = true;
      };
    }
  }, [task]); // perform side effect on task changes.

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTask(todoInput.current!.value);
  };

  return (
    <div>
      {fetchStatus.isError && <p>An error has occurred, please try again...</p>}
      <form onSubmit={handleSubmit}>
        <input ref={todoInput} type="text" />
        <button type="submit">
          {fetchStatus.isLoading ? "Adding Todo..." : "Add Todo"}
        </button>
      </form>
    </div>
  );
};

export default AddTodo;
