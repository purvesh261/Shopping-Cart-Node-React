import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import Home from './Components/Home';
import Cart from './Components/Cart';
import Checkout from './Components/Checkout';
import Confirmation from './Components/Confirmation';
import CreateOrder from './Components/CreateOrder';
import MyAccount from './Components/MyAccount';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import AdminUsers from './Components/Admin/AdminUsers';
import AdminProducts from './Components/Admin/AdminProducts';
import AddProduct from './Components/Admin/AddProduct';
import Sales from './Components/Admin/Sales';
import MRInward from './Components/Admin/MRInward';
import NewMR from './Components/Admin/NewMR';
import Payment from './Components/Payment';
import Razorpay from './Components/Razorpay';
import Page404 from './Components/Page404';

export const ROUTES = [
    { path: '/', key:"HOME", element:<Home />, protected: false},
    { path: '/cart', key:"CART", element:<Cart />, protected: false},
    { path: '/checkout', key:"CHECKOUT", element:<Checkout />, protected: true, admin: false},
    { path: '/checkout/confirmation', key:"CHECKOUT_CONFIRMATION", element:<Confirmation />, protected: true, admin: false},
    { path: '/checkout/create-order', key:"CREATE_ORDER", element:<CreateOrder />, protected: true, admin: false},
    { path: '/payment', key:"PAYMENT", element:<Razorpay />, protected: true, admin: false},
    { path: '/login', key:"LOGIN", element:<Login />, protected: false},
    { path: '/sign-up', key:"SIGN_UP", element:<SignUp />, protected: false},
    { path: '/account', key:"ACCOUNT", element:<MyAccount />, protected: true, admin: false},
    { path: '/admin', key:"ADMIN", element:<Navigate to="/admin/users" />, protected: true, admin: true},
    { path: '/admin/users', key:"ADMIN_USERS", element:<AdminUsers />, protected: true, admin: true},
    { path: '/admin/products', key:"ADMIN_PRODUCTS", element:<AdminProducts />, protected: true, admin: true},
    { path: '/admin/products/new', key:"CREATE_PRODUCT", element:<AddProduct />, protected: true, admin: true},
    { path: '/admin/sales', key:"ADMIN_SALES", element:<Sales />, protected: true, admin: true},
    { path: '/admin/mrinward', key:"ADMIN_MR_INWARD", element:<MRInward />, protected: true, admin: true},
    { path: '/admin/mrinward/new', key:"CREATE_MR", element:<NewMR />, protected: true, admin: true},
    { path: '/admin/mrinward/:mrid/edit', key:"EDIT_MR", element:<NewMR />, protected: true, admin: true},
]

const parseJwt = (token) => {
    try {
        return jwt_decode(token);
    } catch (e) {
        return null;
    }
};

const ProtectedRoute = ({ adminRoute, children}) => 
{
    const user = JSON.parse(localStorage.getItem('user'));
    // redirects to login page if route is protected and user isn't logged in
    if(!user)
    {
        return <Navigate to='/login' />
    }
    else{
        // logs out if token is expired
        const decodedJwt = parseJwt(user.accessToken);
        if (decodedJwt.exp * 1000 < Date.now()) {
            localStorage.clear();
            return <Navigate to='/login' />
        }
    }

    if(adminRoute && !user.admin)
    {
        return <Navigate to='/' />
    }

    return children;
}

function renderRoute(route){
    if(route.protected)
    {
        return <Route
                path={route.path}
                key={route.key}
                element={
                    <ProtectedRoute adminRoute={route.admin}>
                        {route.element}
                    </ProtectedRoute> 
                }
                />
    }
    else{
        return <Route {...route} />
    }
}

export function RenderRouter({ routes }) {
    return (
        <Routes>
            {routes.map(route => {
                return renderRoute(route);
            })}
            <Route path="/*" element={<Page404 />} />
        </Routes>
    );
  }