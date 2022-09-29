import React, { FormEvent, ReactNode, useState } from 'react';
import {
    Alert,
    Button,
    Form,
    FormControl,
    FormGroup,
    FormLabel,
    Spinner,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/index';
import { orderActions } from '../../store/order-slice';
import Item from '../../types/item';

type orderFormProps = {
    children: ReactNode;
};
const OrderForm = (props: orderFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [isError, setIsError] = useState({ status: false, message: '' });
    const dispatch = useDispatch();
    const order = useSelector((state: RootState) => state.order);
    const sendOrder = async (): Promise<{
        message: string;
        order: { id: number };
    }> => {
        let result;
        try {
            const orderToSend: {
                name: string;
                surname: string;
                numberOfPeople: number;
                description: string;
                foods?: Item[];
                liquids?: Item[];
            } = {
                name: order.name,
                surname: order.surname,
                description: order.description,
                numberOfPeople: order.numberOfPeople,
            };
            if (order.foods.length > 0) {
                orderToSend.foods = order.foods;
            }
            if (order.liquids.length > 0) {
                orderToSend.liquids = order.liquids;
            }
            result = await fetch(
                import.meta.env.VITE_BACKEND_URL + '/create-order',
                {
                    method: 'POST',
                    body: JSON.stringify({ order: orderToSend }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!result.ok) {
                throw new Error('Errore di connessione o del server.');
            }
        } catch (error) {
            setIsError({
                status: true,
                message: 'Errore di connessione o del server.',
            });
        }
        let dataFetched;
        if (result) {
            dataFetched = await result.json();
        }
        return dataFetched;
    };
    const onSubmitHandler = async (event: FormEvent) => {
        event.preventDefault();
        if (order.name.length < 0) {
            setIsError({
                status: true,
                message: "Imposta un nome per l'ordine. Poi ri-clicca.",
            });
            return;
        }
        if (order.surname.length < 0) {
            setIsError({
                status: true,
                message: "Imposta un cognome per l'ordine. Poi ri-clicca.",
            });
            return;
        }
        if (order.numberOfPeople < 0) {
            setIsError({
                status: true,
                message: 'Imposta un numero di persone >=0. Poi ri-clicca.',
            });
            return;
        }
        if (order.foods.length === 0 && order.liquids.length === 0) {
            setIsError({
                status: true,
                message:
                    'Seleziona almeno una bevanda o un cibo. Poi ri-clicca.',
            });
            return;
        }
        setIsLoading(true);
        setIsError({ status: false, message: '' });
        const dataFetched = await sendOrder();
        setIsLoading(false);
        if (!dataFetched.order) {
            setIsError({
                status: true,
                message: 'Ordine fallito: ' + dataFetched.message,
            });
            return;
        }
        dispatch(orderActions.resetOrder(null));
        navigate('/confirm/' + dataFetched.order.id, { replace: true });
    };
    const onChangeNameHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        dispatch(orderActions.setName(event.currentTarget.value));
    };
    const onChangeSurnameHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        dispatch(orderActions.setSurname(event.currentTarget.value));
    };
    const onChangeNumOfPeopleHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        dispatch(orderActions.setNumberOfPeople(event.currentTarget.value));
    };
    const onChangeDescriptionHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        dispatch(orderActions.setDescription(event.currentTarget.value));
    };
    const totalPrice =
        [...order.foods]
            .concat([...order.liquids])
            .reduce(
                (prev, current) => prev + current.price * current.quantity,
                0
            )
            .toFixed(2) || '0.00';

    return (
        <Form onSubmit={onSubmitHandler}>
            <FormGroup>
                <FormLabel>Nome</FormLabel>
                <FormControl
                    onChange={onChangeNameHandler}
                    required
                    type="text"
                    value={order.name}
                    placeholder="Nome"
                />
                <FormControl.Feedback type="invalid">
                    Inserire il nome.
                </FormControl.Feedback>
                <Form.Text className="text-muted">Obbligatorio</Form.Text>
            </FormGroup>
            <FormGroup>
                <FormLabel>Cognome</FormLabel>
                <FormControl
                    onChange={onChangeSurnameHandler}
                    required
                    type="text"
                    value={order.surname}
                    placeholder="Cognome"
                />
                <FormControl.Feedback type="invalid">
                    Inserire il cognome.
                </FormControl.Feedback>
                <Form.Text className="text-muted">Obbligatorio</Form.Text>
            </FormGroup>
            <FormGroup>
                <FormLabel>Numero persone</FormLabel>
                <FormControl
                    required
                    type="number"
                    onChange={onChangeNumOfPeopleHandler}
                    placeholder="Numero persone"
                />
                <Form.Text className="text-muted">
                    Obbligatorio (0 = asporto)
                </Form.Text>
                <FormControl.Feedback type="invalid">
                    Inserire il numero di persone.
                </FormControl.Feedback>
            </FormGroup>
            <FormGroup>
                <FormLabel>Descrizione</FormLabel>
                <FormControl
                    as="textarea"
                    rows={2}
                    value={order.description}
                    onChange={onChangeDescriptionHandler}
                    placeholder="Descrivere eventuali dettagli"
                />
                <Form.Text className="text-muted">Opzionale</Form.Text>
            </FormGroup>
            {isError.status && (
                <Alert variant="warning">{isError.message}</Alert>
            )}
            {props.children}
            <h4 style={{ textAlign: 'center' }}>Totale: {totalPrice} €</h4>
            <div className="d-grid gap-2 mb-5">
                <Button
                    type="submit"
                    variant={isError.status ? 'warning' : 'primary'}
                    size="lg"
                    disabled={isLoading}
                >
                    {isLoading && !isError.status && (
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                    )}
                    {!isLoading && isError.status && isError.message}
                    {!isLoading && !isError.status && 'Ordina'}
                </Button>
            </div>
        </Form>
    );
};
export default OrderForm;
