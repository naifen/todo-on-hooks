import { useState, useEffect } from "react";

// FIXME: consider useRef instead
// inspired by: https://stackoverflow.com/a/55409573/2214422
export const useNonInitRender = () => {
    const [nonInitRender, setNonInitRender] = useState(false);
    useEffect(() => setNonInitRender(true), []);

    return nonInitRender;
};
