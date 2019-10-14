export const todoCollectionUrl: string = "http://localhost:4000/todos";

export const todoUrl: (id: string) => string = id => {
  return `http://localhost:4000/todos/${id}`;
};

const createFetchOptions = (method: string, data?: {}) => {
  const defaultOptions = { headers: { "Content-Type": "application/json" } };
  let options: {};
  if (method === "GET" || method === "DELETE") {
    options = { ...defaultOptions, method: method };
  } else {
    options = {
      ...defaultOptions,
      method: method,
      body: JSON.stringify(data)
    };
  }

  return options;
};

interface ApiOptionProps {
  endpoint: string,
  method: string,
  data?: {}
}

// TODO: this API is ugly, also make naming more intuitive, and add tests for components and logic
export const createFetchAndStateHandlers = (
  fetchStatusHandler: { dispatch: React.Dispatch<any> },
  localStateHandler: {
    dispatch: React.Dispatch<any>;
    action: {};
    isAsyncData: boolean;
  },
  successCallBack?: () => void,
  errorCallBack?: () => void
) => {
  let fetchCanceled = false; // fetch cancellation flag

  // call external API and set local state with async data or local data
  const fetchAndDispatch = async (apiOptions: ApiOptionProps) => {
    const fetchOptions = createFetchOptions(apiOptions.method, apiOptions.data);
    fetchStatusHandler.dispatch({ type: "FETCH_INIT" });
    try {
      const response = await fetch(apiOptions.endpoint, fetchOptions);
      const result = await response.json();

      if (
        !fetchCanceled && // avoid updating state if component unmounted
        response.status >= 200 &&
        response.status < 300 &&
        response.ok
      ) {
        fetchStatusHandler.dispatch({ type: "FETCH_SUCCESS" });
        if (localStateHandler.isAsyncData) {
          localStateHandler.dispatch({
            ...localStateHandler.action,
            payload: result
          });
        } else {
          localStateHandler.dispatch(localStateHandler.action);
        }
        if (successCallBack) successCallBack();
      } else {
        fetchStatusHandler.dispatch({ type: "FETCH_FAILURE" });
        if (errorCallBack) errorCallBack();
      }
    } catch (err) {
      console.log(JSON.stringify(err)); // TODO: better error handling
      fetchStatusHandler.dispatch({ type: "FETCH_FAILURE" });
    }
  };

  const setFetchCancellation = (canceled: boolean) => fetchCanceled = canceled;

  return { fetchAndDispatch, setFetchCancellation };
};
