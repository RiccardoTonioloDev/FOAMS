import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { Food } from '../../types/food';
import { Liquid } from '../../types/liquids';
import OrderList from '../orderList/order-list';

const DUMMY_FOODS = [
    {
        id: 1,
        name: 'Insalata',
        category: '3',
        price: 3.99,
    },
    {
        id: 2,
        name: 'Bigoli al ragu',
        category: '1',
        price: 10.99,
    },
    {
        id: 3,
        name: 'Pollo ai ferri',
        category: '2',
        price: 20.99,
    },
    {
        id: 4,
        name: 'Grigliata Mista',
        category: '2',
        price: 25.99,
    },
    {
        id: 6,
        name: 'Pasta con i piselli',
        category: '1',
        price: 12.99,
    },
    {
        id: 7,
        name: 'Nome ultra iper mega super giga lungo',
        category: '3',
        price: 3.99,
    },
];
const DUMMY_LIQUIDS = [
    {
        id: 1,
        name: 'Coca-Cola',
        price: 3.99,
    },
    {
        id: 2,
        name: 'Fanta',
        price: 10.99,
    },
    {
        id: 3,
        name: 'Sprite',
        price: 20.99,
    },
];
const Order = () => {
    const [foods, setFoods] = useState<Food[]>([]);
    const [liquids, setLiquids] = useState<Liquid[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    useEffect(() => {
        const fetchFood = async () => {
            setIsLoading(true);
            // const response = await fetch(
            //     'https://foodorder-production.up.railway.app/foods'
            // );
            // if (!response.ok) {
            //     setIsError(true);
            // }
            // const responseData = await response.json();
            setIsLoading(false);
            // setFoods(responseData.foods);
            setFoods(DUMMY_FOODS);
        };
        const fetchLiquids = async () => {
            setIsLoading(true);
            // const response = await fetch(
            //     'https://foodorder-production.up.railway.app/liquids'
            // );
            // if (!response.ok) {
            //     setIsError(true);
            // }
            // const responseData = await response.json();
            setIsLoading(false);
            // setLiquids(responseData.liquids);
            setLiquids(DUMMY_LIQUIDS);
        };
        try {
            fetchFood();
            fetchLiquids();
        } catch (error) {
            setIsError(true);
        }
    }, []);
    return (
        <>
            <h2>Crea il tuo ordine!</h2>
            {isLoading ? (
                <Spinner animation="border" role="status" />
            ) : (
                <OrderList foods={foods} liquids={liquids} />
            )}
        </>
    );
};

export default Order;
