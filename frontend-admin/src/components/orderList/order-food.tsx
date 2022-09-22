import { Button, FormControl, FormGroup } from 'react-bootstrap';
import { Food } from '../../types/food';
import classes from './order-item.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index';

type OrderFoodProps = {
    food: Food;
    onAdd: (food: Food) => void;
    onDecrease: (id: number) => void;
};
const OrderFood = (props: OrderFoodProps) => {
    const orderItem = useSelector((state: RootState) => {
        return state.order.foods.find((food) => food.id === props.food.id);
    });
    const isItemInOrder = !!orderItem;
    const formToDisplay = isItemInOrder ? (
        <>
            <Button
                onClick={props.onAdd.bind(null, props.food)}
                variant="primary"
            >
                +
            </Button>
            <FormGroup>
                <FormControl
                    type="number"
                    min={0}
                    value={orderItem.quantity}
                    disabled={true}
                    placeholder="Quantità"
                    className={classes.inputStyle}
                />
            </FormGroup>
            <Button onClick={props.onDecrease.bind(null, props.food.id)}>
                -
            </Button>
        </>
    ) : (
        <Button onClick={props.onAdd.bind(null, props.food)}>Aggiungi</Button>
    );
    return (
        <div className={classes.orderItem}>
            <div>
                <div className={classes.itemName}>{props.food.name}</div>
                <div>€ {props.food.price}</div>
            </div>
            <div className={classes.inputsItem}>{formToDisplay}</div>
        </div>
    );
};
export default OrderFood;
