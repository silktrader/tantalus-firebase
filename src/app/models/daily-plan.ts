import { Meal } from "./meal";
import { Portion } from "./portion";
import { IDiaryEntry } from "../diary/planner.service";
import { PortionData } from "../diary/PortionData";

export class DiaryEntry {

    date: Date;
    comments: string;

    complete: boolean = false;
    private meals: Meal[] = [];

    constructor(diaryEntrydata: IDiaryEntry) {


        // for (const portion of diaryEntrydata.portions) {

        //     if (this.meals[portion.mealID] == undefined) {
        //         this.meals[portion.mealID] = new Meal();
        //     }

        //     this.meals[portion.mealID].Portions.push(new Portion(portion.id, portion.quantity, portion.foodID, portion.mealID));
        // }

    }

    public addMeal(meal: Meal): Meal {
        this.meals.push(meal);
        return meal;
    }

    public addPortion(portion: Portion, meal: Meal) {
        let mealIndex = this.meals.indexOf(meal);
        if (mealIndex > -1) {

        }

    }

    public get Meals(): Meal[] {
        return { ...this.meals };
    }

    public get Touched(): boolean {
        return this.meals.length > 0;
    }

    public get Calories(): number {
        let totalCalories: number = 0;
        for (let i = 0; i < this.meals.length; i++)
            totalCalories += this.meals[i].calories;
        return totalCalories;
    }

}
