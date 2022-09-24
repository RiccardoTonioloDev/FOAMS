import { Button, FormControl, FormGroup, FormText } from 'react-bootstrap';
import { Liquid } from '../../types/liquids';
import classes from './order-item.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/index';
import React from 'react';
import { orderActions } from '../../store/order-slice';

type OrderLiquidProps = {
    liquid: Liquid;
    onAdd: (liquid: Liquid) => void;
    onDecrease: (id: number) => void;
};
const OrderLiquid = (props: OrderLiquidProps) => {
    const dispatch = useDispatch();
    const orderItem = useSelector((state: RootState) => {
        return state.order.liquids.find(
            (liquid) => liquid.id === props.liquid.id
        );
    });
    const onChangeSetDescriptionHandler = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        dispatch(
            orderActions.setLiquidDescription({
                id: orderItem!.id,
                description: event.currentTarget.value,
            })
        );
    };
    const isItemInOrder = !!orderItem;
    const formToDisplay = isItemInOrder ? (
        <>
            <Button
                onClick={props.onAdd.bind(null, props.liquid)}
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
                onClick={props.onDecrease.bind(null, props.liquid.id)}
                variant="primary"
                type="button"
            >
                -
            </Button>
        </>
    ) : (
        <Button
            variant="primary"
            onClick={props.onAdd.bind(null, props.liquid)}
            type="button"
        >
            Aggiungi
        </Button>
    );
    return (
        <>
            <div className={classes.orderItem}>
                <div>
                    <div className={classes.itemName}>{props.liquid.name}</div>
                    <div>€ {props.liquid.price}</div>
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
export default OrderLiquid;
