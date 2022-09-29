import { Button, FormControl } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { foodActions } from '../../store/food-slice';
import classes from './ingredientItem.module.css';

type IngredientItemProps = {
    ingredient: { id: number; name: string };
};

const IngredientItem = (props: IngredientItemProps) => {
    const dispatch = useDispatch();
    const ingredientIndex = useSelector((state: RootState) =>
        state.food.ingredients.find(
            (ingredient) => ingredient.id === props.ingredient.id
        )
    );
    const onClickHandler = () => {
        dispatch(
            foodActions.addIngredient({ id: props.ingredient.id, amount: 0 })
        );
    };
    const onAddClickHandler = () => {
        dispatch(
            foodActions.modifyAmount({ id: props.ingredient.id, amount: 1 })
        );
    };
    const onDecreaseClickHandler = () => {
        dispatch(
            foodActions.modifyAmount({ id: props.ingredient.id, amount: -1 })
        );
    };
    return (
        <>
            <div className={classes.ingredientLayout}>
                <div>
                    <h6>{props.ingredient.name}</h6>
                </div>
                <div>
                    {!ingredientIndex && (
                        <Button variant="primary" onClick={onClickHandler}>
                            Usa
                        </Button>
                    )}
                    {ingredientIndex && (
                        <div className={classes.ingredientUsage}>
                            <Button
                                variant={
                                    ingredientIndex.amount === 0
                                        ? 'danger'
                                        : 'primary'
                                }
                                onClick={onDecreaseClickHandler}
                            >
                                -
                            </Button>
                            <FormControl
                                required
                                disabled
                                placeholder="quantità da usare"
                                min={0}
                                value={ingredientIndex.amount}
                                style={{ width: '10rem' }}
                            />
                            <Button
                                variant="primary"
                                onClick={onAddClickHandler}
                            >
                                +
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <hr />
        </>
    );
};
export default IngredientItem;
