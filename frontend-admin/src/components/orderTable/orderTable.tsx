import { Button, Spinner, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
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

    buttonName: string;

    isLoading: boolean;

    onClick: () => void;
};
const OrderTable = (props: OrderTableProps) => {
    const logged = useSelector((state: RootState) => state.login.logged);
    return (
        <>
            <h3 style={{ textAlign: 'center' }} className="mt-3">
                Generalità
            </h3>
            <div style={{ overflowX: 'scroll' }}>
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
                                {props.food.map((food, index) => (
                                    <tr key={index}>
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
                                {props.liquids.map((liquid, index) => (
                                    <tr key={index}>
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
            </div>
            <h5 style={{ textAlign: 'right' }}>Totale: {props.totalPrice} €</h5>
            {logged && (
                <div style={{ textAlign: 'center' }}>
                    <Button onClick={props.onClick} variant="primary">
                        {props.isLoading ? (
                            <Spinner animation="border" role="status" />
                        ) : (
                            props.buttonName
                        )}
                    </Button>
                </div>
            )}
        </>
    );
};
export default OrderTable;
