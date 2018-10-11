import { IFood } from "../foods.service";

export class Food implements IFood {

    get calories(): number {
        return this.proteins * 4 + this.carbs * 4 + this.fats * 9;
    }

    constructor(
        public readonly name: string,
        public readonly brand: string,
        public readonly proteins: number,
        public readonly carbs: number,
        public readonly fats: number
    ) { }

}