import { FoodData } from "../foods.service";

export class Food implements FoodData {

    name: string;
    proteins: number = 0;
    carbs: number = 0;
    fats: number = 0;

    get calories(): number {
        return this.proteins * 4 + this.carbs * 4 + this.fats * 9;
    }

    constructor(foodData: FoodData) {

        this.name = foodData.name;
        this.proteins = foodData.proteins;
        this.carbs = foodData.carbs;
        this.fats = foodData.fats;
    }
}