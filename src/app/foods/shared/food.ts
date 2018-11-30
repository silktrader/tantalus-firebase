
/**
 * Model class substituting interface to remove duplication of fields in children classes: stores data, can't feature properties
 */
export class FoodData {
    public readonly id: string;
    public readonly name: string;
    public readonly proteins: number;
    public readonly carbs: number;
    public readonly fats: number;

    public readonly brand?: string;

    public readonly fibres?: number;
    public readonly sugar?: number;

    public readonly saturated?: number;
    public readonly trans?: number;
    public readonly cholesterol?: number;

    public readonly sodium?: number;
}

export class Food extends FoodData {

    private readonly data: FoodData;

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

    get deserialised(): FoodData {
        return this.data;
    }
}
