import { useReducer } from "react";
import { UiContext, uiReducer } from "./";

export interface UiState {
    isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
    isMenuOpen: false,
};

export const UiProvider = ({ children }:any) => {
    const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

    const toggleSideMenu = () => {
        dispatch({ type: "[UI] - ToggleMenu" });
    }

    return (
        <UiContext.Provider value={{
            ...state,
            toggleSideMenu
        }}>
            {children}
        </UiContext.Provider>
    );
};