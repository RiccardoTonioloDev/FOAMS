import { useEffect, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import OrderTable from '../components/orderTable/orderTable';
import { RootState } from '../store';
import Order from '../types/order';

type paramsType = {
    orderId: string;
};

const ConfirmOrderId = () => {
    const navigate = useNavigate();
    const logged = useSelector((state: RootState) => state.login);
    if (!logged.logged) {
        navigate('/order', { replace: true });
        return <></>;
    }
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState({ status: false, message: '' });
    const [fetchedOrder, setFetchedOrder] = useState<Order>();
    const params = useParams<paramsType>();
    const fetchOrder = async () => {
        let dataFetched: { message: string; order: Order };
        try {
            const response = await fetch(
                import.meta.env.VITE_BACKEND_URL + '/fetch-order',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        order: { id: +params.orderId! },
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            dataFetched = (await response.json()) as {
                message: string;
                order: Order;
            };
            if (!response.ok) {
                throw new Error(dataFetched.message);
            }
            setFetchedOrder(dataFetched.order);
        } catch (error) {
            setIsError({ status: true, message: dataFetched!.message });
        }

        setIsLoading(false);
    };
    useEffect(() => {
        setIsError({ status: false, message: '' });
        fetchOrder();
    }, [params.orderId]);

    return (
        <>
            {isError.status && !isLoading && (
                <Alert variant="warning">{isError.message}</Alert>
            )}
            {!isError.status && isLoading && (
                <Spinner animation="border" role="status" />
            )}
            {!isError.status && !isLoading && !fetchedOrder && (
                <Alert variant="warning">Ordine non trovato.</Alert>
            )}
            {!isError.status && !isLoading && fetchedOrder && (
                <OrderTable
                    description={fetchedOrder.description}
                    food={fetchedOrder.OrderFood}
                    liquids={fetchedOrder.OrderLiquid}
                    name={fetchOrder.name}
                    surname={fetchedOrder.surname}
                    numberOfPeople={fetchedOrder.numberOfPeople}
                    status={fetchedOrder.status}
                    totalPrice={fetchedOrder.totalPrice}
                    orderId={fetchedOrder.id}
                    token={logged.token}
                />
            )}
        </>
    );
};
export default ConfirmOrderId;
