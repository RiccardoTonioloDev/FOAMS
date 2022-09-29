import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import AddItemForm from '../components/addItemForm/addItemForm';
import { RootState } from '../store';

const AddIngredient = () => {
    const login = useSelector((state: RootState) => state.login);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [success, setSuccess] = useState(false);

    const addIngredientAction = async (
        name: string,
        secondProperty: number
    ) => {
        setIsLoading(true);
        setSuccess(false);
        setIsError(false);
        try {
            const result = await fetch(
                import.meta.env.VITE_BACKEND_URL + '/admin/add-ingredient',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        ingredient: {
                            name: name,
                            quantity: secondProperty,
                        },
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
        } catch (error) {
            setIsError(true);
        }
        setIsLoading(false);
    };

    return (
        <>
            {success && (
                <Alert className="mt-3" variant="primary">
                    Ingrediente aggiunto con successo!
                </Alert>
            )}
            {isError && (
                <Alert className="mt-3" variant="warning">
                    Errore di connessione.
                </Alert>
            )}
            <AddItemForm
                type="ingredient"
                titleForm="Aggiungi un nuovo ingrediente:"
                isLoading={isLoading}
                onClick={addIngredientAction}
            />
        </>
    );
};

export default AddIngredient;
