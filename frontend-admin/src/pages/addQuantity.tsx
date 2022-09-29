import { useEffect, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import IncreaseQuantity from '../components/increaseQuantity/increaseQuantity';
import { RootState } from '../store';

const AddQuantity = () => {
    const [isLoadingStart, setIsLoadingStart] = useState(false);
    const login = useSelector((state: RootState) => state.login);
    const [isErrorStart, setErrorStart] = useState(false);
    const [ingredientsFetched, setIngredientsFetched] = useState<{
        ingredients: { id: number; name: string; quantity: number }[];
    }>({ ingredients: [] });
    const [fetched, setFetched] = useState(false);
    useEffect(() => {
        const fetchIngredients = async () => {
            const result = await fetch(
                import.meta.env.VITE_BACKEND_URL + '/ingredients'
            );
            const ingredientsFetched = await result.json();
            setIngredientsFetched(ingredientsFetched);
        };
        setIsLoadingStart(true);
        setErrorStart(false);
        try {
            fetchIngredients();
        } catch (error) {
            setErrorStart(true);
        }
        setIsLoadingStart(false);
        if (!fetched) {
            setFetched(true);
        }
    }, []);
    return (
        <>
            {isLoadingStart && <Spinner animation="border" role="status" />}
            {!isLoadingStart && fetched && isErrorStart && (
                <Alert variant="warning">Errore di connessione.</Alert>
            )}
            {!isLoadingStart &&
                fetched &&
                ingredientsFetched.ingredients.length === 0 && (
                    <Alert variant="warning">
                        Nessun ingrediente esistente.
                    </Alert>
                )}
            {!isLoadingStart && ingredientsFetched.ingredients.length > 0 && (
                <IncreaseQuantity
                    ingredients={ingredientsFetched.ingredients}
                    token={login.token}
                />
            )}
        </>
    );
};
export default AddQuantity;
