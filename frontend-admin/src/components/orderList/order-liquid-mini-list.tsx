import { Liquid } from '../../types/liquids';
import OrderLiquid from './order-liquid';
import classes from './order-mini-list.module.css';

type orderLiquidMiniListProps = {
    name: string;
    liquids: Liquid[];
    onAdd: (food: Liquid) => void;
    onDecrease: (id: number) => void;
};
const OrderLiquidMiniList = (props: orderLiquidMiniListProps) => {
    return (
        <div>
            <h4 className={classes.titleMiniList}>{props.name}</h4>
            {props.liquids.map((liquid) => (
                <div key={liquid.id}>
                    <OrderLiquid
                        onAdd={props.onAdd}
                        onDecrease={props.onDecrease}
                        liquid={liquid}
                    />
                    <hr />
                </div>
            ))}
        </div>
    );
};
export default OrderLiquidMiniList;
