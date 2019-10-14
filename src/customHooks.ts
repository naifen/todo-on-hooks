import { useRef, useEffect } from "react";

// inspired by: https://stackoverflow.com/a/53180013/12216912
// the problem with useState like the following is it trigger an additional useless render
// const [nonInitRender, setNonInitRender] = useState(false);
// useEffect(() => setNonInitRender(true), []);
// return nonInitRender;

export const useInitialRender = () => {
  const isInitRef = useRef(true);

  useEffect(() => {
    isInitRef.current = false;
  }, []);

  return isInitRef.current;
};
