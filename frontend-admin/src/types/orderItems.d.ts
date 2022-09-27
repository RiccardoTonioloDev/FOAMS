import OrderFood from '../components/orderList/order-food';
import { Food } from './food';
import { Liquid } from './liquids';

export interface OrderFood extends Food {
    quantity: number;
    description: string;
}
export interface OrderLiquid extends Liquid {
    description: string;
    quantity: number;
}
