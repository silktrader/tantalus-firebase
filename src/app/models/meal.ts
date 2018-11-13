import { Portion } from './portion';

export class Meal {

    constructor(public readonly order: number) { }

    get portions(): ReadonlyArray<Portion> {
        return this._portions;
    }

    get calories(): number {
        let totalCalories = 0;
        for (let i = 0; i < this._portions.length; i++)
            totalCalories += this._portions[i].food.calories * this._portions[i].quantity;
        return totalCalories;
    }

    private _portions: Portion[] = [];

    public get name(): string {
        return Meal.getName(this.order);
    }

    public static getName(order: number): string {
        switch (order) {
            case 0: return 'Breakfast';
            case 1: return 'Morning';
            case 2: return 'Lunch';
            case 3: return 'Afternoon';
            case 4: return 'Dinner';
            default: return 'Snacks';
        }
    }

    // tk handle duplicate portions with same id?
    public addPortion(portion: Portion) {
        this._portions.push(portion);
    }
}
