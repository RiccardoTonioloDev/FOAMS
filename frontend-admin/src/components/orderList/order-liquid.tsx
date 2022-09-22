import { Button, FormControl, FormGroup } from 'react-bootstrap';
import { Liquid } from '../../types/liquids';
import classes from './order-item.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index';

type OrderLiquidProps = {
    liquid: Liquid;
    onAdd: (liquid: Liquid) => void;
    onDecrease: (id: number) => void;
};
const OrderLiquid = (props: OrderLiquidProps) => {
    const orderItem = useSelector((state: RootState) => {
        return state.order.liquids.find(
            (liquid) => liquid.id === props.liquid.id
        );
    });
    const isItemInOrder = !!orderItem;
    const formToDisplay = isItemInOrder ? (
        <>
            <Button
                onClick={props.onAdd.bind(null, props.liquid)}
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
            <Button onClick={props.onDecrease.bind(null, props.liquid.id)}>
                -
            </Button>
        </>
    ) : (
        <Button onClick={props.onAdd.bind(null, props.liquid)}>Aggiungi</Button>
    );
    return (
        <div className={classes.orderItem}>
            <div>
                <div className={classes.itemName}>{props.liquid.name}</div>
                <div>€ {props.liquid.price}</div>
            </div>
            <div className={classes.inputsItem}>{formToDisplay}</div>
        </div>
    );
};
export default OrderLiquid;
