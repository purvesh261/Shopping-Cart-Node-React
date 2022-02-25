import React, { useContext} from 'react';
import { LoginDetails } from '../App';
import { useLocation } from 'react-router-dom';

function ConfirmOrder() {
    const contextData = useContext(LoginDetails);
    return (
        <>
            <div>ConfirmOrder</div>
            { contextData.checkout.address }
            { contextData.checkout.phone }
        </>
    )
}

export default ConfirmOrder;