import { AuthState } from "./";
import { IUser } from "../../interfaces";

type AuthActionType = 
    | { type: '[Auth] - LOGIN', payload: IUser }
    | { type: '[Auth] - LOGOUT' };

export const authReducer = (state:AuthState, action: AuthActionType): AuthState => {
    switch (action.type) {
        case '[Auth] - LOGIN':
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload
            }
        case '[Auth] - LOGOUT':
            return {
                ...state,
                isLoggedIn: false,
                user: undefined
            }
        default:
            return state;
    };
};
