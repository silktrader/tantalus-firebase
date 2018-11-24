import { Meal } from './meal';

export class DiaryEntry {

    public readonly meals: ReadonlyArray<Meal>;

    constructor(meals: Meal[]) {
        this.meals = meals || [];
    }

    private getAggregate(propertyName: string): number {
        let total = 0;
        for (let i = 0; i < this.meals.length; i++)
            total += this.meals[i][propertyName];
        return total;
    }

    public get calories(): number {
        return this.getAggregate('calories');
    }

    public get proteins(): number {
        return this.getAggregate('proteins');
    }

    public get carbs(): number {
        return this.getAggregate('carbs');
    }

    public get fats(): number {
        return this.getAggregate('fats');
    }

}
