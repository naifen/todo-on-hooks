export const todoCollectionUrl: string = "http://localhost:4000/todos";

export const todoUrl: (id: string) => string = (id) => {
    return `http://localhost:4000/todos/${id}`;
}

export const fetchAndDispatch = (
  fetchOptions: { endpoint: string, method: string, data?: {} },
  fetchHandler: { statusDispatch: React.Dispatch<any>, cancelFlag: boolean },
  stateHandler: { dispatch: React.Dispatch<any>, action: {}, asyncData: boolean },
  successCallBack?: () => void,
  errorCallBack?: () => void) => {
  const defaultOptions = { headers: { "Content-Type": "application/json" }};
  let options: {};
  if (fetchOptions.method === 'GET' || fetchOptions.method === 'DELETE') {
    options = {...defaultOptions, method: fetchOptions.method };
  } else {
    options = {
      ...defaultOptions,
      method: fetchOptions.method,
      body: JSON.stringify(fetchOptions.data)
    };
  }

  return async () => {
    fetchHandler.statusDispatch({ type: "FETCH_INIT" });
    try {
      const response = await fetch(fetchOptions.endpoint, options);
      const result = await response.json();

      if ( // TODO: passing cancelFlag as closure might not prevent setState on unmounted
        !fetchHandler.cancelFlag && // avoid updating state if component unmounted
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
