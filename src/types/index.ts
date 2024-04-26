export type UserType = {
    id:number,
    firstName:string,
    lastName:string,
    username:string,
    email:string,
    dateCreated:string
}

export type UserFormDataType = {
    firstName:string,
    lastName:string,
    username:string,
    email:string,
    password:string,
    confirmPassword:string
}

export type RecipeType = {
    id: number, 
    name:string,
    description: string,
    cuisine: string,
    cookTime:string,
    servings: string,
    ingredients:string,
    instructions:string,
    dateCreated: string,
    author:UserType, 
    comments: string

}

export type RecipeFormDataType = {
    name:string,
    description:string,
    cuisine:string,
    cookTime: string,
    servings: string,
    ingredients: string,
    instructions:string
}


export type TokenType = {
    token:string,
    tokenExpiration:string
}

export type apiResponseType  = {
    meals: apiRecipeType[] | []
}

export type apiRecipeType = {
        idMeal: string,
        strMeal: string | null,
        strDrinkAlternate: null,
        strCategory: string | null,
        strArea: string | null,
        strInstructions: string | null,
        strMealThumb: string | null,
        strTags: string | null,
        strYoutube: string | null,
        strIngredient1: string | null,
        strIngredient2: string | null,
        strIngredient3: string | null,
        strIngredient4: string | null,
        strIngredient5: string | null,
        strIngredient6: string | null,
        strIngredient7: string | null,
        strIngredient8: string | null,
        strIngredient9: string | null,
        strIngredient10: string | null,
        strIngredient11: string | null,
        strIngredient12: string | null,
        strIngredient13: string | null,
        strIngredient14:string | null,
        strIngredient15: string | null,
        strIngredient16: string | null,
        strIngredient17: string | null,
        strIngredient18: string | null,
        strIngredient19: string | null,
        strIngredient20: string | null,
        strMeasure1: string | null,
        strMeasure2: string | null,
        strMeasure3:string | null,
        strMeasure4: string | null,
        strMeasure5: string | null,
        strMeasure6: string | null,
        strMeasure7: string | null,
        strMeasure8: string | null,
        strMeasure9: string | null,
        strMeasure10: string | null,
        strMeasure11: string | null,
        strMeasure12: string | null,
        strMeasure13: string | null,
        strMeasure14: string | null,
        strMeasure15: string | null,
        strMeasure16: string | null,
        strMeasure17: string | null,
        strMeasure18: string | null,
        strMeasure19: string | null,
        strMeasure20: string | null,
        strSource: string | null,
        strImageSource: string | null,
        strCreativeCommonsConfirmed: string | null,
        dateModified: string | null,
    }
