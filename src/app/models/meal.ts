import { Portion } from "./portion";

export class Meal {

    private portions: Portion[];
    public id: number = 1;

    constructor() { }

    get Portions(): Portion[] {
        return { ...this.portions };
    }

    get Calories(): number {
        let totalCalories: number = 0;
        for (let i = 0; i < this.portions.length; i++)
            totalCalories += this.portions[i].food.calories * this.portions[i].quantity;
        return totalCalories;
    }
}
