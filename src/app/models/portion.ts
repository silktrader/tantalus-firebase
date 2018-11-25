import { Food } from '../foods/food';
import { PortionData } from '../diary/PortionData';

export class Portion implements PortionData {

    constructor(public id: string, public quantity: number, public food: Food, public mealID: number) {

    }

    get foodID(): string {
        return this.food.id;
    }

    get proteins(): number {
        return this.food.proteins * this.quantity / 100;
    }

    get carbs(): number {
        return this.food.carbs * this.quantity / 100;
    }

    get fats(): number {
        return this.food.fats * this.quantity / 100;
    }

    get calories(): number {
        return this.food.calories * this.quantity / 100;
    }

    get serialised(): PortionData {
        return { id: this.id, quantity: this.quantity, foodID: this.foodID, mealID: this.mealID };
    }
}
