/**
 * Model class substituting interface to remove duplication of fields in children classes: stores data, can't feature properties
 */
export class FoodData {
    public readonly id: string;
    public readonly name: string;
    public readonly proteins: number;
    public readonly carbs: number;
    public readonly fats: number;

    public readonly source?: string;
    public readonly notes?: string;

    public readonly fibres?: number;
    public readonly sugar?: number;
    public readonly starch?: number;

    public readonly saturated?: number;
    public readonly trans?: number;
    public readonly cholesterol?: number;

    public readonly sodium?: number;
    public readonly potassium?: number;
    public readonly calcium?: number;
    public readonly magnesium?: number;

    public readonly zinc?: number;
    public readonly iron?: number;
}

export enum FoodProp {
    name = 'name', source = 'source', notes = 'notes',
    calories = 'calories',
    proteins = 'proteins',
    carbs = 'carbs',
    fats = 'fats',
    fibres = 'fibres',
    sugar = 'sugar',
    starch = 'starch',
    saturated = 'saturated',
    trans = 'trans',
    cholesterol = 'cholesterol',
    sodium = 'sodium',
    calcium = 'calcium',
    potassium = 'potassium',
    magnesium = 'magnesium',
    zinc = 'zinc',
    iron = 'iron',
    fatPercentage = 'fatsPercentage',
    carbsPercentage = 'carbsPercentage',
    proteinsPercentage = 'proteinsPercentage',
    detailsPercentage = 'detailsPercentage'
}

export class Food extends FoodData {

    constructor(data: FoodData) {
        super();

        // the object is meant to be immutable so the serialised data which it's built on is always in sync
        this.data = data;
        Object.assign(this, data);

    }

    get calories(): number {
        return this.proteins * 4 + this.carbs * 4 + this.fats * 9;
    }

    get approximateCalories(): number {
        return Math.round(this.calories);
    }

    get proteinsPercentage(): number {
        return this.proteins * 4 / this.calories;
    }

    get carbsPercentage(): number {
        return this.carbs * 4 / this.calories;
    }

    get fatsPercentage(): number {
        return this.fats * 9 / this.calories;
    }

    get detailsPercentage(): number {
        let undefinedProperties = 0;
        for (const prop of Food.detailProperties) {
            if (this.data[prop] === undefined)
                undefinedProperties++;
        }
        return 1 - undefinedProperties / Food.detailProperties.length;
    }

    get deserialised(): FoodData {
        return this.data;
    }

    private static readonly detailProperties = [FoodProp.fibres, FoodProp.sugar,
    FoodProp.saturated, FoodProp.trans, FoodProp.cholesterol, FoodProp.sodium];

    private readonly data: FoodData;
}
