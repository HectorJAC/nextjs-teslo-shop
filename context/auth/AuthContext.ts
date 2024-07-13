import { IUser } from "@/interfaces";
import { createContext } from "react";

interface AuthContextProps {
    isLoggedIn: boolean;
    user?: IUser;
    loginUser: (email: string, password: string) => Promise<boolean>;
    registerUser: (name: string, email: string, password: string) => Promise<{
        hasError: boolean;
        message?: string;
    }>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);