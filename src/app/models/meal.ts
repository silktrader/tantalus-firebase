import { Portion } from './portion';

export class Meal {

    constructor(public readonly order: number) { }

    get portions(): ReadonlyArray<Portion> {
        return this._portions;
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

    private getTotalMacronutrient(macro: string) {
        let total = 0;
        for (let i = 0; i < this._portions.length; i++)
            total += this._portions[i].food[macro] * this._portions[i].quantity / 100;
        return total;
    }

    public get calories(): number {
        return this.getTotalMacronutrient('calories');
    }

    public get proteins(): number {
        return this.getTotalMacronutrient('proteins');
    }

    public get carbs(): number {
        return this.getTotalMacronutrient('carbs');
    }

    public get fats(): number {
        return this.getTotalMacronutrient('fats');
    }
}
