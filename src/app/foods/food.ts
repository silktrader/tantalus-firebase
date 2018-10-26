import { FoodData } from '../FoodData';

export class Food implements FoodData {

    public readonly id: string;
    public readonly name: string;
    public readonly brand: string;
    public readonly proteins: number;
    public readonly carbs: number;
    public readonly fats: number;

    constructor(data: FoodData) {

        this.id = data.id;
        this.name = data.name;
        this.brand = data.brand;
        this.proteins = data.proteins;
        this.carbs = data.carbs;
        this.fats = data.fats;
    }

    get calories(): number {
        return this.proteins * 4 + this.carbs * 4 + this.fats * 9;
    }

    get approximateCalories(): number {
        return Math.round(this.calories);
    }
}
