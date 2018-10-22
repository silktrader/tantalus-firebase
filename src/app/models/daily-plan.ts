import { Meal } from "./meal";


export class DailyPlan {

    date: Date;
    comments: string;

    complete: boolean = false;
    private meals: Meal[] = [];

    public addMeal(meal: Meal): Meal {
        this.meals.push(meal);
        return meal;
    }

    public get Meals(): Meal[] {
        return { ...this.meals };
    }

}
