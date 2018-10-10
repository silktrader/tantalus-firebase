import { FoodData } from "../foods.service";

export class Food implements FoodData {

    //public readonly name: string;
    // public readonly proteins: number = 0;
    // public readonly carbs: number = 0;
    // public readonly fats: number = 0;

    get calories(): number {
        return this.proteins * 4 + this.carbs * 4 + this.fats * 9;
    }

    // constructor(foodData: FoodData) {

    //     this.name = foodData.name;
    //     this.proteins = foodData.proteins;
    //     this.carbs = foodData.carbs;
    //     this.fats = foodData.fats;
    // }

    constructor(public readonly name: string, public readonly brand: string = "", public readonly proteins: number, public readonly carbs: number, public readonly fats: number) {

    }
}