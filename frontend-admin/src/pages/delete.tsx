import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Button,
    ButtonGroup,
    Form,
    FormGroup,
    FormLabel,
    FormSelect,
    FormText,
    Spinner,
    ToggleButton,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';

const Delete = () => {
    const login = useSelector((state: RootState) => state.login);
    const [updateState, setUpdateState] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [listOfItems, setListOfItems] = useState<
        { name: string; id: number }[]
    >([]);
    const selectRef = useRef<HTMLSelectElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, message: '' });
    const [fetched, setFetched] = useState(false);
    const [success, setSuccess] = useState(false);
    const [nameOfObjectToDelete, setNameOfObjectToDelete] = useState('');

    const radios = [
        { name: 'Ingredienti', value: 'ingredient' },
        { name: 'Cibi', value: 'food' },
        { name: 'Bevande', value: 'liquid' },
    ];
    const radioOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedCategory(event.currentTarget.value);
    };
    const selectOnChangeHandler = () => {
        setNameOfObjectToDelete(
            listOfItems.find((item) => item.id === +selectRef.current!.value)!
                .name
        );
    };
    useEffect(() => {
        if (selectedCategory) {
            const fetchList = async () => {
                const result = await fetch(
                    import.meta.env.VITE_BACKEND_URL +
                        '/' +
                        selectedCategory +
                        's'
                );
                if (!result.ok) {
                    throw new Error('Errore di connessione.');
                }
                const items = await result.json();
                setListOfItems(items[selectedCategory + 's']);
            };
            setIsError({ status: false, message: '' });
            setIsLoading(true);
            try {
                fetchList();
                setFetched(true);
            } catch (error) {
                setIsError({ status: true, message: 'Errore di connesione.' });
            }
            setIsLoading(false);
        }
    }, [selectedCategory, updateState]);
    const onSubmitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        setSuccess(false);
        const idToDelete = selectRef.current!.value;
        if (!selectedCategory) {
            setIsError({
                status: true,
                message: 'Categoria non selezionata.',
            });
            return;
        }
        if (!idToDelete || +idToDelete < 0) {
            setIsError({ status: true, message: 'Oggetto non selezionato.' });
            return;
        }
        setIsError({ status: false, message: '' });
        setIsLoading(true);
        setSuccess(false);
        try {
            const body: any = {};
            body[selectedCategory + 'Id'] = +idToDelete;
            const result = await fetch(
                import.meta.env.VITE_BACKEND_URL +
                    '/admin/delete-' +
                    selectedCategory,
                {
                    method: 'DELETE',
                    body: JSON.stringify({
                        [selectedCategory + 'Id']: +idToDelete,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + login.token,
                    },
                }
            );
            if (!result.ok) {
                throw new Error('Errore di connessione.');
            }
            setSuccess(true);
            setUpdateState((prevState) => !prevState);
        } catch (error) {
            setIsError({ status: true, message: 'Errore di connessione.' });
        }
        setIsLoading(false);
    };
    let categoryName = selectedCategory
        ? radios.find((radio) => radio.value === selectedCategory)!.name
        : '';
    if (!login.logged) {
        return <Navigate to="/order" />;
    }

    return (
        <>
            {isError.status && (
                <Alert variant="warning" className="mt-3">
                    {isError.message}
                </Alert>
            )}
            {success && (
                <Alert variant="primary" className="mt-3">
                    Oggetto '{nameOfObjectToDelete}' eliminato con successo!
                </Alert>
            )}
            <div
                style={{
                    display: 'flex',
                    flexFlow: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2rem',
                }}
            >
                <Form style={{ width: '60%' }} onSubmit={onSubmitHandler}>
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
                                    checked={selectedCategory === radio.value}
                                    onChange={radioOnChange}
                                >
                                    {radio.name}
                                </ToggleButton>
                            ))}
                        </ButtonGroup>
                        <FormText className="text-muted">
                            Scegliere la categoria dell' oggetto da eliminare.
                        </FormText>
                    </FormGroup>
                    {selectedCategory && listOfItems.length > 0 && (
                        <>
                            <FormGroup>
                                <FormLabel>
                                    Seleziona oggetto da eliminare:
                                </FormLabel>
                                <FormSelect
                                    ref={selectRef}
                                    required
                                    onChange={selectOnChangeHandler}
                                    defaultValue={-1}
                                >
                                    <option value={-1}>{categoryName}</option>
                                    {listOfItems.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </FormSelect>
                                {selectedCategory === 'food' && (
                                    <FormText className="text-muted">
                                        Assicurarsi che tutti gli ingredienti
                                        abbiano la quantià a '10' per fare si
                                        che tutti i cibi siano visibili.
                                    </FormText>
                                )}
                            </FormGroup>
                            <div
                                style={{
                                    display: 'flex',
                                    flexFlow: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: '1rem',
                                }}
                            >
                                <Button type="submit" variant="danger">
                                    {isLoading ? (
                                        <Spinner
                                            role="status"
                                            animation="border"
                                        />
                                    ) : (
                                        'Elimina'
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                    {selectedCategory &&
                        listOfItems.length === 0 &&
                        fetched && (
                            <Alert variant="primary">
                                Nessun elemento trovato!
                            </Alert>
                        )}
                </Form>
            </div>
        </>
    );
};
export default Delete;
