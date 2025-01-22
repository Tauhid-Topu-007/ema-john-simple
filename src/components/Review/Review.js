import React, { useEffect, useState} from 'react';
import { getDatabaseCart, processOrder, removeFromDatabaseCart } from '../../utilities/databaseManager';
import fakeData from '../../fakeData';
import ReviewItem from '../ReviewItem/ReviewItem';
import Cart from '../Cart/Cart';
import happyImage from '../../images/giphy.gif';
import { useNavigate } from 'react-router-dom';
import './Review.css';


const Review = () => {
    const[cart,setCart]=useState([]);
    const [orderPlaced,setOrderPlaced]=useState(false);
    const navigate= useNavigate();

    const handlePrceedCheckout=()=>{
        navigate('/shipment');
    }
    const removeProduct=(productKey)=>{
        // console.log('remove clicked',productKey);
        const newCart=cart.filter(pd=>pd.key !==productKey);
        setCart(newCart);
        removeFromDatabaseCart(productKey);
    }

    useEffect(()=>{
        //cart
        const savedCart =getDatabaseCart();
        const productKeys=Object.keys(savedCart);

        const cartProducts=productKeys.map(key=>{
            const product=fakeData.find(pd=>pd.key===key)
            product.quantity=savedCart[key];
            return product;
        });
        // console.log(cartProducts);
        setCart(cartProducts);
    },[]);

    let thankYou;
    if(orderPlaced){
        thankYou=<img src={happyImage} alt="" />
    }
    return (
        <div className='twin-container'>
            <div className="product-container">
            {
                cart.map(pd=><ReviewItem key={pd.key}
                    removeProduct={removeProduct} product={pd}></ReviewItem>)
            }
            {
                thankYou
            }
            </div>
            <div className="cart-container">
                <Cart cart={cart}>
                    <button onClick={handlePrceedCheckout} className="main-button">Proceed Checkout</button>
                </Cart>
            </div>
        </div>
    );
};

export default Review;