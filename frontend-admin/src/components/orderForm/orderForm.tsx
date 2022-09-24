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
            result = await fetch(
                import.meta.env.VITE_BACKEND_URL + '/create-order',
                {
                    method: 'POST',
                    body: JSON.stringify({ order: order }),
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
        const isNameNotBlank = order.name.length > 0;
        const isSurnameNotBlank = order.surname.length > 0;
        const isNumberOfPeopleGTEZero = order.numberOfPeople >= 0;
        const atLeastOneFood = order.foods.length > 0;
        const atLeastOneLiquid = order.liquids.length > 0;
        if (
            isNameNotBlank &&
            isSurnameNotBlank &&
            isNumberOfPeopleGTEZero &&
            (atLeastOneFood || atLeastOneLiquid)
        ) {
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
        }
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
                    defaultValue={0}
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
            <div className="d-grid gap-2 mb-5">
                <Button type="submit" variant="primary" size="lg">
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
