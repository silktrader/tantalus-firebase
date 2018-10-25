import { FoodData } from "../foods.service";

export class Food implements FoodData {

    get calories(): number {
        return this.proteins * 4 + this.carbs * 4 + this.fats * 9;
    }

    get approximateCalories(): number {
        return Math.round(this.calories);
    }

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly brand: string,
        public readonly proteins: number,
        public readonly carbs: number,
        public readonly fats: number
    ) { }
}