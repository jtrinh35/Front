import React from 'react';
import { useSelector } from 'react-redux';

const CartLength = () => {

    const cart = useSelector((state) => state.cart);
    let length;
    console.log(length);
    cart && cart.cartItems.orderItems.length > 0 ? (length = cart.cartItems.orderItems.map((product) => product.Qty).reduce((a, b) => a + b)): (length = 0);
    console.log(cart);

    console.log(length);

    return length;
};

export default CartLength;