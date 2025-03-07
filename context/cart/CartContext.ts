import { ICartProduct, ShippingAddress } from "../../interfaces";
import { createContext } from "react";

interface CartContextProps {
    isLoaded: boolean;  
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;

    shippingAddress?: ShippingAddress;

    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeCartProduct: (product: ICartProduct) => void;
    updateAddress: (shippingAddress: ShippingAddress) => void;
    createOrder: () => Promise<{hasError: boolean; message: string}>
;}

export const CartContext = createContext({} as CartContextProps);
