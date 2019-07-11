export const todoCollectionUrl: string = "http://localhost:4000/todos";

export const todoUrl: (id: string) => string = (id) => {
    return `http://localhost:4000/todos/${id}`;
}

const createFetchOptions = (method: string, data?: {}) => {
  const defaultOptions = { headers: { "Content-Type": "application/json" }};
  let options: {};
  if (method === 'GET' || method === 'DELETE') {
    options = {...defaultOptions, method: method };
  } else {
    options = {
      ...defaultOptions,
      method: method,
      body: JSON.stringify(data)
    };
  }

  return options;
}

export const fetchAndDispatch = (
  apiOptions: { endpoint: string, method: string, data?: {} },
  fetchHandler: { statusDispatch: React.Dispatch<any>, isCanceled: boolean },
  stateHandler: { dispatch: React.Dispatch<any>, action: {}, asyncData: boolean },
  successCallBack?: () => void,
  errorCallBack?: () => void) => {
  const fetchOptions = createFetchOptions(apiOptions.method, apiOptions.data);

  return async () => {
    fetchHandler.statusDispatch({ type: "FETCH_INIT" });
    try {
      const response = await fetch(apiOptions.endpoint, fetchOptions);
      const result = await response.json();

      if ( // TODO: passing cancelFlag as closure may not prevent setState on unmounted
        !fetchHandler.isCanceled && // avoid updating state if component unmounted
        response.status >= 200 &&
        response.status < 300 &&
        response.ok
      ) {
        fetchHandler.statusDispatch({ type: "FETCH_SUCCESS" });
        if (stateHandler.asyncData) {
          stateHandler.dispatch({ ...stateHandler.action, payload: result });
        } else {
          stateHandler.dispatch(stateHandler.action);
        }
        if (successCallBack) successCallBack();
      } else {
        fetchHandler.statusDispatch({ type: "FETCH_FAILURE" });
        if (errorCallBack) errorCallBack();
      }
    } catch (err) {
      console.log(JSON.stringify(err));
      fetchHandler.statusDispatch({ type: "FETCH_FAILURE" });
    }
  }
}
