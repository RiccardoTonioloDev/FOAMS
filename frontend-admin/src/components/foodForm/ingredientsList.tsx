import { FormLabel } from 'react-bootstrap';
import IngredientItem from './ingredientItem';

type IngredientsListProps = {
    ingredients: { id: number; name: string }[];
};
const IngredientsList = (props: IngredientsListProps) => {
    return (
        <>
            <FormLabel className="mt-2">
                Seleziona ingredienti da usare:
            </FormLabel>
            <div
                className="p-3"
                style={{
                    overflowY: 'scroll',
                    height: '22rem',
                    border: '1px solid lightblue',
                    borderRadius: '15px',
                }}
            >
                {props.ingredients.map((ingredient) => (
                    <IngredientItem
                        key={ingredient.id}
                        ingredient={ingredient}
                    />
                ))}
            </div>
        </>
    );
};

export default IngredientsList;
