import { createContext } from "react";

interface UiContextProps {
    isMenuOpen: boolean;
    toggleSideMenu: () => void
}

export const UiContext = createContext({} as UiContextProps);