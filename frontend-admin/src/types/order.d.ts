import { OrderFood, OrderLiquid } from './orderItems';

type Order = {
    id: number;
    name: string;
    surname: string;
    numberOfPeople: number;
    description: string;
    status: string;
    totalPrice: number;
    OrderFood: OrderFood[];
    OrderLiquid: OrderLiquid[];
};
export default Order;
