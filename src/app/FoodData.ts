export interface FoodData {
    name: string;
    brand: string;
    proteins: number;
    carbs: number;
    fats: number;
}

export interface FoodDataID extends FoodData {
    id: string;
}
