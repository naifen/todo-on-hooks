import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useReducer
} from "react";
import uuid from "uuid/v4";
import { TodoContext } from "../context";
import { todoCollectionUrl, createFetchAndStateHandlers } from "../helpers";
import { useNonInitRender } from "../customHooks";
import fetchStatusReducer from "../reducers/fetchStatusReducer";

const AddTodo: React.FC = () => {
  const dispatchTodo = useContext(TodoContext);
  const nonInitRender = useNonInitRender();
  const [task, setTask] = useState("");
  const todoInput = useRef<HTMLInputElement>(null);
  const [fetchStatus, dispatchFetchStatus] = useReducer(fetchStatusReducer, {
    isLoading: false,
    isError: false
  });

  useEffect(() => {
    if (nonInitRender) {
      const todo = { task: task, id: uuid(), complete: false };
      const {
        fetchAndDispatch,
        setFetchCancellation
      } = createFetchAndStateHandlers(
        { dispatch: dispatchFetchStatus },
        {
          dispatch: dispatchTodo,
          action: { type: "ADD_TODO", payload: todo },
          isAsyncData: false
        },
        () => (todoInput.current!.value = "")
      );
      fetchAndDispatch({
        endpoint: todoCollectionUrl,
        method: "POST",
        data: todo
      });

      return () => {
        setFetchCancellation(true);
      };
    }
  }, [task]); // perform side effect on task changes.
  // FIXME:
  // Warning: React Hook useEffect has missing dependencies: 'dispatch',
  //'nonInitRender'. Either include them or remove the dependency
  // array  react-hooks/exhaustive-dep

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
