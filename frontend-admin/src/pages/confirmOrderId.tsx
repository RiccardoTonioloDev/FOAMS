import { useEffect, useState } from 'react';
import { Accordion, Alert, Spinner } from 'react-bootstrap';
import AccordionItem from 'react-bootstrap/esm/AccordionItem';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import OrderTable from '../components/orderTable/orderTable';
import { RootState } from '../store';
import Order from '../types/order';

type paramsType = {
    orderId: string;
};

const ConfirmOrderId = () => {
    const navigate = useNavigate();
    const logged = useSelector((state: RootState) => state.login);

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

    const [isLoadingTable, setIsLoadingTable] = useState(false);
    const [isErrorTable, setIsErrorTable] = useState({
        status: false,
        message: '',
    });
    const [confirmed, setConfirmed] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const [ingredientsToExclude, setIngredientsToExclude] = useState<number[]>(
        []
    );
    const sendConfirmation = async () => {
        setIsErrorTable({ status: false, message: '' });
        setMessages([]);
        const buildedBody: {
            order: { id: number; ingredientsToExclude?: number[] };
        } = { order: { id: +params.orderId! } };
        if (ingredientsToExclude.length > 0) {
            buildedBody.order.ingredientsToExclude = [...ingredientsToExclude];
        }
        let dataFetched: {
            message: string;
            messages: string[];
            subZeroIngredients: { id: number }[];
        } = { message: '', messages: [], subZeroIngredients: [] };
        setIsLoadingTable(true);
        try {
            const order = buildedBody.order;
            const result = await fetch(
                import.meta.env.VITE_BACKEND_URL + '/admin/confirm-order',
                {
                    method: 'PATCH',
                    body: JSON.stringify({ order }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + logged.token,
                    },
                }
            );
            dataFetched = await result.json();
            if (!result.ok) {
                throw new Error(dataFetched.message);
            }
            setConfirmed(true);
            setTimeout(() => {
                navigate('/print/' + params.orderId);
            }, 1500);
        } catch (error) {
            if (
                dataFetched &&
                dataFetched.messages &&
                dataFetched.messages.length > 0
            ) {
                setIngredientsToExclude(
                    dataFetched.subZeroIngredients.map(
                        (szi: { id: number }) => szi.id
                    )
                );
                setMessages([...dataFetched.messages]);
                setIsErrorTable({
                    status: true,
                    message: "Mancano alcuni ingredienti nell'ordine.",
                });
            }
            setIsErrorTable({ status: true, message: 'Connection error.' });
        }
        setIsLoadingTable(false);
    };
    useEffect(() => {
        setIsError({ status: false, message: '' });
        fetchOrder();
    }, [params.orderId]);

    return (
        <>
            {isError.status && !isLoading && (
                <Alert variant="warning" className="mt-3">
                    {isError.message}
                </Alert>
            )}
            {!isError.status && isLoading && (
                <Spinner animation="border" role="status" />
            )}
            {!isError.status && !isLoading && !fetchedOrder && (
                <Alert variant="warning" className="mt-3">
                    Ordine non trovato.
                </Alert>
            )}
            {!isError.status && !isLoading && fetchedOrder && (
                <>
                    {!logged.logged && (
                        <div
                            style={{
                                marginTop: '2rem',
                                display: 'flex',
                                flexFlow: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <h3
                                style={{
                                    margin: 0,
                                    textDecoration: 'underline',
                                }}
                            >
                                Ordine numero: {fetchedOrder.id}
                            </h3>
                            <p
                                style={{
                                    margin: 0,
                                    color: 'red',
                                    textAlign: 'center',
                                }}
                            >
                                Non perdere questo numero o perderai il tuo
                                ordine!
                            </p>
                            <p style={{ margin: 0, textAlign: 'center' }}>
                                Porta questo numero alla cassa per pagare
                                l'ordine.
                            </p>
                        </div>
                    )}
                    {confirmed && (
                        <Alert variant="primary" className="mt-3">
                            Ordine confermato con successo! Reindirizzamento
                            alla stampa.
                        </Alert>
                    )}
                    {isErrorTable.status &&
                        (!messages || messages.length === 0) && (
                            <Alert variant="warning" className="mt-3">
                                Errore di connessione.
                            </Alert>
                        )}
                    {isErrorTable.status && messages && messages.length > 0 && (
                        <Accordion className="m-3" defaultActiveKey="0">
                            <AccordionItem eventKey="0">
                                <Accordion.Header>
                                    Lista piatti con elementi mancanti
                                </Accordion.Header>
                                <Accordion.Body>
                                    {messages.map((message) => (
                                        <Alert variant="warning" key={message}>
                                            {message}
                                        </Alert>
                                    ))}
                                </Accordion.Body>
                            </AccordionItem>
                        </Accordion>
                    )}
                    <OrderTable
                        description={fetchedOrder.description}
                        food={fetchedOrder.OrderFood}
                        liquids={fetchedOrder.OrderLiquid}
                        name={fetchedOrder.name}
                        surname={fetchedOrder.surname}
                        numberOfPeople={fetchedOrder.numberOfPeople}
                        status={fetchedOrder.status}
                        totalPrice={fetchedOrder.totalPrice}
                        orderId={fetchedOrder.id}
                        token={logged.token}
                        isLoading={isLoadingTable}
                        onClick={sendConfirmation}
                        buttonName="Conferma ordine"
                    />
                </>
            )}
        </>
    );
};
export default ConfirmOrderId;
