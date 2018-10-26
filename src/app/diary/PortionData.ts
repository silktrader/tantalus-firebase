import { Food } from '../foods/food';
export interface PortionData {
    id?: string;
    mealID: number;
    foodID: string;
    food?: Food;
    quantity: number;
}
