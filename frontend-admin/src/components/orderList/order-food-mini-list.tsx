import { Food } from '../../types/food';
import OrderFood from './order-food';
import classes from './order-mini-list.module.css';

type orderFoodMiniListProps = {
    name: string;
    foods: Food[];
    onAdd: (food: Food) => void;
    onDecrease: (id: number) => void;
};
const OrderFoodMiniList = (props: orderFoodMiniListProps) => {
    return (
        <div>
            <h4 className={classes.titleMiniList}>{props.name}</h4>
            {props.foods.map((food) => (
                <div key={food.id}>
                    <OrderFood
                        onAdd={props.onAdd}
                        onDecrease={props.onDecrease}
                        food={food}
                    />
                    <hr />
                </div>
            ))}
        </div>
    );
};
export default OrderFoodMiniList;
