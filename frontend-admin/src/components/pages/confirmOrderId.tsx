import { useParams } from 'react-router-dom';

type paramsType = {
    orderId: string;
};

const ConfirmOrderId = () => {
    const params = useParams<paramsType>();

    return <div>Confirm order: {params.orderId}</div>;
};
export default ConfirmOrderId;
