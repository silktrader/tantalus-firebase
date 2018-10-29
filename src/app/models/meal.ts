import { Portion } from './portion';

export class Meal {

    private _portions: Portion[] = [];
    public id: number;

    constructor() { }

    public addPortion(portion: Portion) {
        this._portions.push(portion);
    }

    get portions(): ReadonlyArray<Portion> {
        return this._portions;
    }

    get calories(): number {
        let totalCalories = 0;
        for (let i = 0; i < this._portions.length; i++)
            totalCalories += this._portions[i].food.calories * this._portions[i].quantity;
        return totalCalories;
    }
}
