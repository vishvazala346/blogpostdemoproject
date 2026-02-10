import React, { useState, createContext } from "react";

export const ModeContext = createContext({
    mode: "light",
    toggleMode: () => {},
});

export const ModeContextProvider = (props) => {
    const [mode, setMode] = useState("light");

    const toggleMode = () => {
        if (mode === "light") {
            setMode("dark");
        } else {
            setMode("light");
        }
    };

    return (
        <ModeContext.Provider value={{ mode: mode, toggleMode }}>
            {props.children}
        </ModeContext.Provider>
    );
};