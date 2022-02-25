import React, { useContext, useEffect } from 'react';
import { LoginDetails } from '../App';

function ConfirmOrder() {
    const contextData = useContext(LoginDetails);
    const navigate = useNavigate();
    const contextData = useContext(LoginDetails);

    useEffect(() => {
        if (!contextData.loggedIn)
        {
            navigate("/login");
        }
    }, []);
    return (
        <>
            <div>ConfirmOrder</div>
            { contextData.checkout.address }
            { contextData.checkout.phone }
        </>
    )
}

export default ConfirmOrder;