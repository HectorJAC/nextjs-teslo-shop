import { useEffect, useReducer } from "react";
import { IUser } from "@/interfaces";
import { AuthContext, authReducer } from '.';
import { tesloApi } from "@/api";
import Cookies from 'js-cookie';
import axios from "axios";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
};

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
};

export const AuthProvider = ({children}:any) => {
    const [ state, dispatch ] = useReducer(authReducer, AUTH_INITIAL_STATE);
    const router = useRouter();

    const { data, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            dispatch({type: '[Auth] - LOGIN', payload: data?.user as IUser})
        }
    }, [status, data])

    // useEffect(() => {
    //     checkToken();
    // }, []);

    const checkToken = async() => {
        if (!Cookies.get('token')) {
            return;
        }

        try {
            const { data } = await tesloApi.get('/user/validate-token');
            const { token, user } = data;
            Cookies.set('token', token );
            dispatch({ type: '[Auth] - LOGIN', payload: user });
        } catch (error) {
            Cookies.remove('token');
        }
    }

    const loginUser = async(email:string, password:string): Promise<boolean> => {
        try {
            const { data } = await tesloApi.post('user/login', { email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - LOGIN', payload: user });
            return true;
        } catch (error) {
            return false;
        }
    };

    const registerUser = async(name:string, email:string, password:string): Promise<{
        hasError: boolean;
        message?: string;
    }> => {
        try {
            const { data } = await tesloApi.post('user/register', { name, email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - LOGIN', payload: user }); 
            return {
                hasError: false
            }
        } catch (error) {
            if(axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'No se pudo crear el usuario. Intente de nuevo.'
            }
        }
    };

    const logout = () => {
        Cookies.remove('cart');
        Cookies.remove('firstName');
        Cookies.remove('lastName');
        Cookies.remove('address');
        Cookies.remove('address2');
        Cookies.remove('zip');
        Cookies.remove('city');
        Cookies.remove('country');
        Cookies.remove('phone');
        signOut();

        //Cookies.remove('token');
        //router.reload();
    };

    return (
        <AuthContext.Provider value={{
            ...state,
            loginUser,
            registerUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
