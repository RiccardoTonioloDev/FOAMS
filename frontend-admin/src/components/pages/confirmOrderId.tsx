import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

type paramsType = {
    orderId: string;
};

const ConfirmOrderId = () => {
    const params = useParams<paramsType>();
    // useEffect(()=>{

    // },[params.orderId]);

    return <div>Confirm order: {params.orderId}</div>;
};
export default ConfirmOrderId;
