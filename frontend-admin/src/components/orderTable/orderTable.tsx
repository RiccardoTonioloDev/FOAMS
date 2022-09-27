import { useState } from 'react';
import { Accordion, Alert, Button, Spinner, Table } from 'react-bootstrap';
import AccordionItem from 'react-bootstrap/esm/AccordionItem';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { OrderFood, OrderLiquid } from '../../types/orderItems';

type OrderTableProps = {
    food: OrderFood[];
    liquids: OrderLiquid[];
    name: string;
    surname: string;
    numberOfPeople: number;
    description: string;
    status: string;
    totalPrice: number;
    orderId: number;
    token: string;
};
const OrderTable = (props: OrderTableProps) => {
    const [isLoadingTable, setIsLoadingTable] = useState(false);
    const [isErrorTable, setIsErrorTable] = useState({
        status: false,
        message: '',
    });
    const [ingredientsToExclude, setIngredientsToExclude] = useState<number[]>(
        []
    );
    const [messages, setMessages] = useState<string[]>([]);
    const navigate = useNavigate();

    // const sendConfirmation = async () => {
    //     setIsError({ status: false, message: '' });
    //     setMessages([]);
    //     const buildedBody: {
    //         order: { id: number; ingredientsToExclude?: number[] };
    //     } = { order: { id: props.orderId } };
    //     if (ingredientsToExclude.length > 0) {
    //         buildedBody.order.ingredientsToExclude = [...ingredientsToExclude];
    //     }
    //     let dataFetched: {
    //         message: string;
    //         messages: string[];
    //         subZeroIngredients: { id: number }[];
    //     } = { message: '', messages: [], subZeroIngredients: [] };
    //     setIsLoading(true);
    //     try {
    //         const result = await fetch(
    //             import.meta.env.VITE_BACKEND_URL + '/confirm-order',
    //             {
    //                 method: 'PATCH',
    //                 body: JSON.stringify({ buildedBody }),
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     Authorization: 'Bearer ' + props.token,
    //                 },
    //             }
    //         );
    //         dataFetched = await result.json();
    //         if (!result.ok) {
    //             throw new Error(dataFetched.message);
    //         }
    //         navigate('/print/' + props.orderId);
    //     } catch (error) {
    //         if (dataFetched && dataFetched.messages.length > 0) {
    //             setIngredientsToExclude(
    //                 dataFetched.subZeroIngredients.map(
    //                     (szi: { id: number }) => szi.id
    //                 )
    //             );
    //             setMessages([...dataFetched.messages]);
    //             setIsError({
    //                 status: true,
    //                 message: "Mancano alcuni ingredienti nell'ordine.",
    //             });
    //         }
    //         setIsError({ status: true, message: 'Connection error.' });
    //     }
    //     setIsLoading(false);
    // };

    return (
        <>
            {isErrorTable.status && messages.length > 0 && (
                <Accordion defaultActiveKey="0">
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
            <h3 style={{ textAlign: 'center' }} className="mt-3">
                Generalità
            </h3>
            <Table striped bordered hover size="sm" className="m-3">
                <thead>
                    <tr>
                        <th>Nome:</th>
                        <th>Cognome:</th>
                        <th>N. Persone:</th>
                        <th>Status Ordine:</th>
                        <th>Ordine numero:</th>
                        <th colSpan={2}>Descrizione:</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{props.name}</td>
                        <td>{props.surname}</td>
                        <td>{props.numberOfPeople}</td>
                        <td
                            style={{
                                color:
                                    props.status === 'PENDING'
                                        ? 'orange'
                                        : 'green',
                            }}
                        >
                            {props.status}
                        </td>
                        <td>{props.orderId}</td>
                        <td colSpan={2}>{props.description}</td>
                    </tr>
                </tbody>
            </Table>
            {props.food.length > 0 && (
                <>
                    <h3 style={{ textAlign: 'center' }}>Cibi</h3>
                    <Table striped bordered hover size="sm" className="m-3">
                        <thead>
                            <tr>
                                <th>Categoria:</th>
                                <th>Cibo:</th>
                                <th>Quantità:</th>
                                <th>Prezzo:</th>
                                <th>Descrizione:</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.food.map((food) => (
                                <tr key={food.id}>
                                    <td>{food.category}</td>
                                    <td>{food.name}</td>
                                    <td>{food.quantity}</td>
                                    <td>{food.price}</td>
                                    <td>{food.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
            {props.liquids.length > 0 && (
                <>
                    <h3 style={{ textAlign: 'center' }}>Bevande</h3>
                    <Table striped bordered hover size="sm" className="m-3">
                        <thead>
                            <tr>
                                <th>Bevanda:</th>
                                <th>Quantità:</th>
                                <th>Prezzo:</th>
                                <th>Descrizione:</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.liquids.map((liquid) => (
                                <tr key={liquid.id}>
                                    <td>{liquid.name}</td>
                                    <td>{liquid.quantity}</td>
                                    <td>{liquid.price}</td>
                                    <td>{liquid.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
            <h5 style={{ textAlign: 'right' }}>Totale: {props.totalPrice} €</h5>
            <div style={{ textAlign: 'center' }}>
                <Button variant="primary">
                    {isLoadingTable ? (
                        <Spinner animation="border" role="status" />
                    ) : (
                        'Conferma ordine'
                    )}
                </Button>
            </div>
        </>
    );
};
export default OrderTable;
