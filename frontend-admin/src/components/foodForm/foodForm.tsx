import {
    Alert,
    Button,
    Form,
    FormControl,
    FormGroup,
    FormLabel,
    Spinner,
} from 'react-bootstrap';
import React, { useRef, useState } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { foodActions } from '../../store/food-slice';
import IngredientsList from './ingredientsList';

type FoodFormProps = {
    ingredients: { id: number; name: string }[];
};
const FoodForm = (props: FoodFormProps) => {
    const food = useSelector((state: RootState) => state.food);
    const login = useSelector((state: RootState) => state.login);
    const dispatch = useDispatch();
    const [isError, setIsError] = useState({ status: false, message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [checked, setChecked] = useState(false);
    const [radioValue, setRadioValue] = useState('1');
    const priceRef = useRef<HTMLInputElement>(null);
    const radios = [
        { name: 'Primo', value: '1' },
        { name: 'Secondo', value: '2' },
        { name: 'Contorno', value: '3' },
    ];
    const nameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(foodActions.changeName(event.currentTarget.value));
    };
    const radioOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(
            foodActions.changeCategory(
                event.currentTarget.value as '1' | '2' | '3'
            )
        );
    };
    const priceOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(foodActions.changePrice(+event.currentTarget.value));
    };

    const createFood = (event: React.FormEvent) => {
        event.preventDefault();
        setSuccess(false);
        setIsError({ status: false, message: '' });
        if (!food.name) {
            setIsError({ status: true, message: 'Nome non valido.' });
            return;
        }
        if (!food.category) {
            setIsError({ status: true, message: 'Categoria non selezionata.' });
            return;
        }
        if (!food.price) {
            setIsError({ status: true, message: 'Prezzo non valido.' });
            return;
        }
        if (food.ingredients.length === 0) {
            setIsError({
                status: true,
                message: 'Selezionare almeno un ingrediente.',
            });
            return;
        }

        setIsLoading(true);
        try {
            const result = fetch(
                import.meta.env.VITE_BACKEND_URL + '/admin/add-food',
                {
                    method: 'POST',
                    body: JSON.stringify({ food }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + login.token,
                    },
                }
            );
            setSuccess(true);
        } catch (error) {
            setIsError({ status: true, message: 'Errore di connessione.' });
        }
        setIsLoading(false);
        dispatch(foodActions.resetFood(null));
        priceRef.current!.value = '';
    };

    return (
        <>
            {isError.status && (
                <Alert className="mt-3" variant="warning">
                    {isError.message}
                </Alert>
            )}
            {success && (
                <Alert className="mt-3" variant="primary">
                    Cibo creato con successo!
                </Alert>
            )}
            <div>
                <h2>Crea un nuovo cibo:</h2>
                <Form onSubmit={createFood}>
                    <FormGroup>
                        <FormLabel>Nome cibo:</FormLabel>
                        <FormControl
                            required
                            onChange={nameOnChange}
                            value={food.name}
                            type="text"
                            placeholder="Nome cibo"
                        />
                    </FormGroup>
                    <FormGroup style={{ display: 'flex', flexFlow: 'column' }}>
                        <FormLabel>Categoria cibo:</FormLabel>
                        <ButtonGroup>
                            {radios.map((radio) => (
                                <ToggleButton
                                    key={radio.value}
                                    id={`radio-${radio.value}`}
                                    type="radio"
                                    variant="outline-primary"
                                    name="radio"
                                    value={radio.value}
                                    checked={food.category === radio.value}
                                    onChange={radioOnChange}
                                >
                                    {radio.name}
                                </ToggleButton>
                            ))}
                        </ButtonGroup>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Prezzo cibo (in valuta locale):</FormLabel>
                        <FormControl
                            required
                            onChange={priceOnChange}
                            step={0.01}
                            type="number"
                            ref={priceRef}
                            placeholder="Prezzo cibo"
                        />
                    </FormGroup>
                    <IngredientsList ingredients={props.ingredients} />
                    <div className="m-2" style={{ textAlign: 'center' }}>
                        <Button type="submit" variant="primary">
                            {isLoading ? (
                                <Spinner animation="border" role="status" />
                            ) : (
                                'Invia'
                            )}
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    );
};
export default FoodForm;
