import { ChangeEvent, FormEvent, useRef } from 'react';
import {
    Alert,
    Badge,
    Button,
    Card,
    Form,
    FormControl,
    FormGroup,
    FormLabel,
    FormSelect,
    Spinner,
} from 'react-bootstrap';
import classes from './increaseQuantity.module.css';
import { useState } from 'react';

type IncreaseQuantityProps = {
    ingredients: { id: number; name: string; quantity: number }[];
    token: string;
    updateHandler: () => void;
};
const IncreaseQuantity = (props: IncreaseQuantityProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [invalidForm, setInvalidForm] = useState(false);
    const [selectValue, setSelectValue] = useState(-1);
    const selectRef = useRef<HTMLSelectElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const [dataFetched, setDataFetched] = useState<{
        item: { quantity: number };
    }>();
    const selectOnChangeHandler = (event: ChangeEvent) => {
        const value = selectRef.current!.value;
        setSelectValue(+value);
    };
    const onSubmitHandler = async (event: FormEvent) => {
        event.preventDefault();
        setSuccess(false);
        setIsError(false);
        setInvalidForm(false);
        if (selectValue < 0) {
            setInvalidForm(true);
            return;
        }
        if (+quantityRef.current!.value < 1) {
            setInvalidForm(true);
            return;
        }
        setIsLoading(true);
        try {
            const result = await fetch(
                import.meta.env.VITE_BACKEND_URL + '/admin/add-quantity',
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        ingredient: {
                            id: props.ingredients.find(
                                (ingredient) => ingredient.id === selectValue
                            )!.id,
                            quantity: +quantityRef.current!.value,
                        },
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + props.token,
                    },
                }
            );
            if (!result.ok) {
                throw new Error('Errore di connessione.');
            }
            setDataFetched(await result.json());
            setSuccess(true);
            props.updateHandler();
            quantityRef.current!.value = '';
        } catch (error) {
            setIsError(true);
        }
        setIsLoading(false);
    };
    return (
        <>
            <div className={classes.pageStyling}>
                {invalidForm && (
                    <Alert className="mt-2" variant="warning">
                        Ingrediente o quantità non validi.
                    </Alert>
                )}
                {isError && (
                    <Alert className="mt-2" variant="warning">
                        Errore di connessione.
                    </Alert>
                )}
                {success && dataFetched && (
                    <Alert className="mt-2" variant="primary">
                        Quantità incrementata con successo.
                    </Alert>
                )}
                <Card className={classes.cardExternal}>
                    <Card.Title
                        style={{ marginTop: '1rem', marginBottom: '1rem' }}
                    >
                        Aumenta la quantità di un ingrediente
                    </Card.Title>
                    <Card.Body>
                        <Form onSubmit={onSubmitHandler}>
                            <FormGroup>
                                <FormLabel>Seleziona un ingrediente:</FormLabel>
                                <FormSelect
                                    ref={selectRef}
                                    onChange={selectOnChangeHandler}
                                    required
                                    defaultValue={-1}
                                >
                                    <option value={-1}>Ingredienti</option>
                                    {props.ingredients.map((ingredient) => (
                                        <option
                                            key={ingredient.id}
                                            value={ingredient.id}
                                        >
                                            {ingredient.name}
                                        </option>
                                    ))}
                                </FormSelect>
                            </FormGroup>
                            {selectValue >= 0 && (
                                <h6
                                    className="m-1"
                                    style={{ textAlign: 'center' }}
                                >
                                    Quantità corrente:
                                    <Badge bg="primary">
                                        {
                                            props.ingredients.find(
                                                (ingredient) =>
                                                    ingredient.id ===
                                                    selectValue
                                            )!.quantity
                                        }
                                    </Badge>
                                </h6>
                            )}
                            <FormGroup className="m-1">
                                <FormLabel>Quantità da aggiungere:</FormLabel>
                                <FormControl
                                    ref={quantityRef}
                                    type="number"
                                    min={1}
                                    required
                                    placeholder="Quantità"
                                ></FormControl>
                            </FormGroup>
                            <div
                                style={{
                                    textAlign: 'center',
                                    marginTop: '1rem',
                                }}
                            >
                                <Button type="submit" variant="primary">
                                    {isLoading ? (
                                        <Spinner
                                            role="status"
                                            animation="border"
                                        />
                                    ) : (
                                        'Invia'
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};
export default IncreaseQuantity;
