import { Button, FormControl, FormGroup, FormText } from 'react-bootstrap';
import { Food } from '../../types/food';
import classes from './order-item.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/index';
import { orderActions } from '../../store/order-slice';

type OrderFoodProps = {
    food: Food;
    onAdd: (food: Food) => void;
    onDecrease: (id: number) => void;
};
const OrderFood = (props: OrderFoodProps) => {
    const dispatch = useDispatch();
    const orderItem = useSelector((state: RootState) => {
        return state.order.foods.find((food) => food.id === props.food.id);
    });
    const onChangeSetDescriptionHandler = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        dispatch(
            orderActions.setFoodDescription({
                id: orderItem!.id,
                description: event.currentTarget.value,
            })
        );
    };
    const isItemInOrder = !!orderItem;
    const formToDisplay = isItemInOrder ? (
        <>
            <Button
                onClick={props.onAdd.bind(null, props.food)}
                variant="primary"
                type="button"
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
            <Button
                variant="primary"
                type="button"
                onClick={props.onDecrease.bind(null, props.food.id)}
            >
                -
            </Button>
        </>
    ) : (
        <Button
            variant="primary"
            type="button"
            onClick={props.onAdd.bind(null, props.food)}
        >
            Aggiungi
        </Button>
    );
    return (
        <>
            <div className={classes.orderItem}>
                <div>
                    <div className={classes.itemName}>{props.food.name}</div>
                    <div>€ {props.food.price}</div>
                </div>
                <div className={classes.inputsItem}>{formToDisplay}</div>
            </div>
            {isItemInOrder && (
                <FormGroup className="mb-3">
                    <FormControl
                        size="sm"
                        as="textarea"
                        rows={1}
                        placeholder="Eventuale descrizione da aggiungere all'ordine."
                        onChange={onChangeSetDescriptionHandler}
                        value={orderItem.description}
                    ></FormControl>
                    <FormText className="text-muted">Opzionale.</FormText>
                </FormGroup>
            )}
        </>
    );
};
export default OrderFood;
