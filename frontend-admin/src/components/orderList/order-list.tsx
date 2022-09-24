import { useDispatch } from 'react-redux';
import { Food } from '../../types/food';
import { Liquid } from '../../types/liquids';
import OrderFoodMiniList from './order-food-mini-list';
import { orderActions } from '../../store/order-slice';
import OrderLiquidMiniList from './order-liquid-mini-list';

type OrderListProps = {
    foods: Food[];
    liquids: Liquid[];
};

const OrderList = (props: OrderListProps) => {
    const dispatch = useDispatch();
    const onAddFoodHandler = (food: Food) => {
        dispatch(orderActions.addFoodToOrder(food));
    };
    const onDecreaseFoodHandler = (id: number) => {
        dispatch(orderActions.decreaseFoodFromOrder({ id: id }));
    };
    const onAddLiquidHandler = (liquid: Liquid) => {
        dispatch(orderActions.addLiquidToOrder(liquid));
    };
    const onDecreaseLiquidHandler = (id: number) => {
        dispatch(orderActions.decreaseLiquidFromOrder({ id: id }));
    };
    const first = props.foods.filter((food) => food.category === '1');
    const firstExist = first.length > 0;
    const second = props.foods.filter((food) => food.category === '2');
    const secondExist = second.length > 0;
    const sideDish = props.foods.filter((food) => food.category === '3');
    const sideDishExist = sideDish.length > 0;
    const liquidsExist = props.liquids.length > 0;
    return (
        <>
            {firstExist && (
                <OrderFoodMiniList
                    onAdd={onAddFoodHandler}
                    onDecrease={onDecreaseFoodHandler}
                    name="Primi"
                    foods={first}
                />
            )}
            {secondExist && (
                <OrderFoodMiniList
                    onAdd={onAddFoodHandler}
                    onDecrease={onDecreaseFoodHandler}
                    name="Secondi"
                    foods={second}
                />
            )}
            {sideDishExist && (
                <OrderFoodMiniList
                    onAdd={onAddFoodHandler}
                    onDecrease={onDecreaseFoodHandler}
                    name="Contorni"
                    foods={sideDish}
                />
            )}
            {liquidsExist && (
                <OrderLiquidMiniList
                    onAdd={onAddLiquidHandler}
                    onDecrease={onDecreaseLiquidHandler}
                    name="Bevande"
                    liquids={props.liquids}
                />
            )}
        </>
    );
};

export default OrderList;
