import { useState, useEffect } from "react";

export const useNonInitRender = () => {
    const [nonInitRender, setNonInitRender] = useState(false);
    useEffect(() => setNonInitRender(true), []);

    return nonInitRender;
};
