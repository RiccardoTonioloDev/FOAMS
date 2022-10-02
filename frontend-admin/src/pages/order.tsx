import { useEffect, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { Food } from '../types/food';
import { Liquid } from '../types/liquids';
import OrderForm from '../components/orderForm/orderForm';
import OrderList from '../components/orderList/order-list';
import Footer from '../components/footer/footer';

const Order = () => {
    const [foods, setFoods] = useState<Food[]>([]);
    const [liquids, setLiquids] = useState<Liquid[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    useEffect(() => {
        const fetchFood = async () => {
            const response = await fetch(
                import.meta.env.VITE_BACKEND_URL + '/foods'
            );
            if (!response.ok) {
                setIsError(true);
            }
            const responseData = await response.json();
            setFoods(responseData.foods);
            // setFoods(DUMMY_FOODS);
        };
        const fetchLiquids = async () => {
            const response = await fetch(
                import.meta.env.VITE_BACKEND_URL + '/liquids'
            );
            if (!response.ok) {
                setIsError(true);
            }
            const responseData = await response.json();
            setLiquids(responseData.liquids);
            // setLiquids(DUMMY_LIQUIDS);
        };
        const fetchEverything = async () => {
            setIsLoading(true);
            await fetchFood();
            await fetchLiquids();
            setIsLoading(false);
        };
        try {
            fetchEverything();
        } catch (error) {
            setIsError(true);
        }
    }, []);

    return (
        <>
            <h2>Crea il tuo ordine!</h2>
            {isLoading && !isError && (
                <>
                    <Spinner animation="border" role="status" />
                    <p>Caricamento di cibi e bevande...</p>
                </>
            )}
            {isError && (
                <Alert key="danger">Errore nella richiesta dei cibi!</Alert>
            )}
            {!isLoading && !isError && (
                <>
                    <OrderForm>
                        {foods.length === 0 && !isLoading && (
                            <Alert variant="primary">
                                Nessun cibo trovato!
                            </Alert>
                        )}
                        <OrderList foods={foods} liquids={liquids} />
                        {liquids.length === 0 && !isLoading && (
                            <Alert variant="primary">
                                Nessuna bevanda trovata!
                            </Alert>
                        )}
                    </OrderForm>
                    <Footer />
                </>
            )}
        </>
    );
};

export default Order;
