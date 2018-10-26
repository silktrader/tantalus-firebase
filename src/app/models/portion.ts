import { Food } from '../foods/food';
import { PortionData } from '../diary/PortionData';

export class Portion implements PortionData {

    constructor(public id: string, public quantity: number, public food: Food, public mealID: number) {

    }

    get foodID() {
        return this.food.id;
    }
}
