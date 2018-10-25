import { Food } from "../foods/food";
import { IPortion } from "../diary/planner.service";

export class Portion implements IPortion {

    constructor(public id: string, public quantity: number, public food: Food, public mealID: number) {

    }

    get foodID() {
        return this.food.id;
    }

    // id: string;

    // public quantity: number;
    // public food: Food;

    // public foodID: string;
    // public mealID: number;
}
