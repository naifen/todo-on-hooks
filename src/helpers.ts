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

export const fetchAndDispatch = (
  apiOptions: { endpoint: string, method: string, data?: {} },
  fetchStatusHandler: { dispatch: React.Dispatch<any> },
  stateHandler: {
    dispatch: React.Dispatch<any>;
    action: {};
    isAsyncData: boolean;
  },
  successCallBack?: () => void,
  errorCallBack?: () => void
) => {
  const fetchOptions = createFetchOptions(apiOptions.method, apiOptions.data);
  let fetchCanceled = false; // fetch cancellation flag
  // AbortController is another option: https://developer.mozilla.org/en-US/docs/Web/API/AbortControlle

  const makeRequest = async () => {
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
        if (stateHandler.isAsyncData) {
          stateHandler.dispatch({ ...stateHandler.action, payload: result });
        } else {
          stateHandler.dispatch(stateHandler.action);
        }
        if (successCallBack) successCallBack();
      } else {
        fetchStatusHandler.dispatch({ type: "FETCH_FAILURE" });
        if (errorCallBack) errorCallBack();
      }
    } catch (err) {
      console.log(JSON.stringify(err));
      fetchStatusHandler.dispatch({ type: "FETCH_FAILURE" });
    }
  };

  const setFetchCancellation = (canceled: boolean) => fetchCanceled = canceled;

  return { makeRequest, setFetchCancellation };
};
