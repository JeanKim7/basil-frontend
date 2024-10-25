import axios from 'axios';
import { UserType, UserFormDataType, TokenType, RecipeType, RecipeFormDataType, apiResponseType, IngredientType, IngredientFormType, InstructionType, InstructionFormType } from '../types';

const baseURL = 'https://project-basil-database.onrender.com'
const userEndpoint = '/users'
const recipeEndpoint = '/recipes'
const tokenEndpoint = '/token'

const apiURL = 'https://www.themealdb.com/api/json/v1/1'


//basic request shape for accessing server with no authentication
const apiClientNoAuth = () => axios.create({
    baseURL: baseURL
})

//basic request shape for accessing server when user has logged in and is authenticated
const apiClientBasicAuth = (username:string, password:string) => axios.create({
    baseURL: baseURL,
    headers: {
        Authorization: 'Basic ' + btoa(username + ':' + password)
    }
})

//request for authorizing user after submitting token
const apiClientTokenAuth = (token:string) => axios.create({
    baseURL: baseURL,
    headers: {
        Authorization: 'Bearer ' + token
    }
})

//basic request for accessing the mealdb API
const apiFoodNoAuth = () => axios.create({
    baseURL: apiURL
})

//type for API response, could have data or error message
type APIResponse<T> = {
    data?: T,
    error?: string
}

//request for creating new user
async function register(newUserData:UserFormDataType): Promise<APIResponse<UserType>>{
    let data;
    let error;
    try{
        const response = await apiClientNoAuth().post(userEndpoint, newUserData);
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong'
        }
    }
    return { data, error }
}

//request for logging in to server, recieve token
async function login(username:string, password:string): Promise<APIResponse<TokenType>>{
    let data;
    let error;
    try{
        const response = await apiClientBasicAuth(username,password).get(tokenEndpoint)
        data = response.data
    } catch(err){
        if (axios.isAxiosError(err)){
            error=err.response?.data.error 
        } else {
            error='Something went wrong'
        }
    }
    return {data, error}
}

//request for retrieving info about user from server
async function getMe(token:string): Promise<APIResponse<UserType>>{
    let data;
    let error;
    try {
        const response = await apiClientTokenAuth(token).get(userEndpoint + '/me')
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong'
        }
    }
    return { data, error }
}

//request for getting all recipes from server, no authentication required
async function getAllRecipes(): Promise<APIResponse<RecipeType[]>>{
    let data;
    let error;
    try{
        const response = await apiClientNoAuth().get(recipeEndpoint);
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong'
        }
    }
    return { data, error }

}

//request for creating recipe; input recipe, instructions and ingredients
async function createRecipe(token:string, recipeData: RecipeFormDataType, ingredientsData: IngredientFormType[], instructionsData: InstructionFormType[]) {
    let data;
    let error;
    let data1;
    let data2;
    console.log(recipeData)
    try{
        const response = await apiClientTokenAuth(token).post(recipeEndpoint, recipeData)
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong'
        }
    }
    //submitting all instructions and ingredients at once with Promise.all request
    if (data) {
        data1 = await Promise.all(
            ingredientsData.map(
                i => apiClientTokenAuth(token).post(`/recipes/${data.id}/ingredients`, i))
        )
        data2= await Promise.all(
            instructionsData.map(
                i => apiClientTokenAuth(token).post(`/recipes/${data.id}/instructions`, i))
            )
    }
    return { data, data1, data2, error }
}

//request for one id specifically, usually when showing one recipe in a card after clicking on it from the table
async function getRecipeById(recipeId:string|number) {
    let data;
    let error;
    let data1;
    let data2;
    try{
        const response = await apiClientNoAuth().get(recipeEndpoint + '/' + recipeId)
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.message
        } else {
            error = 'Something went wrong'
        }
    }
    //fetch all ingredients and instructions for that one recipe
    if (data) {
        const response1 = await apiClientNoAuth().get(`/recipes/${recipeId}/ingredients`);
        data1=response1.data;
        const response2= await apiClientNoAuth().get(`/recipes/${recipeId}/instructions`);
        data2=response2.data
    }
    return [data, data1, data2, error]
}

//request to edit a recipe
async function editRecipeById(token:string, recipeId:string|number,  editedRecipeData: Partial<RecipeFormDataType>, editedIngredients: Partial<IngredientType>[], newIngredients: Partial<IngredientFormType>[], deletedIds: string[] | number[], editedInstructions: Partial<InstructionType>[], newInstructions: Partial<InstructionFormType>[], deletedIds2: string[] | number[]) {
    let data;
    let error;
    let data1;
    let data2;
    let data3;
    let data4;
    let data5;
    let data6
    try{
        const response = await apiClientTokenAuth(token).put(recipeEndpoint + '/' + recipeId, editedRecipeData)
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data?.error || `Recipe with ID ${recipeId} does not exist`
        } else {
            error = 'Something went wrong'
        }
    }
    if (data) {
        //requests to edit, create and delete all ingredients and instructions that were edited, use promise.all request for each type
        if (editedIngredients.length>0){
        data1 = await Promise.all (editedIngredients.map(i => apiClientTokenAuth(token).put(`/recipes/ingredients/${i.id}`, i)))}
        
        if (newIngredients.length>=0){
        data2 = await Promise.all (newIngredients.map(i => apiClientTokenAuth(token).post(`/recipes/${recipeId}/ingredients`, i)))}

        if (deletedIds.length>0){
        data3 = await Promise.all(deletedIds.map(i => apiClientTokenAuth(token).delete(`/recipes/ingredients/${i}`)))}
        
        if (editedInstructions.length>0){
        data4 = await Promise.all (editedInstructions.map(i => apiClientTokenAuth(token).put(`/recipes/instructions/${i.id}`, i)))}

        if (newInstructions.length>0){
        data5 = await Promise.all (newInstructions.map(i => apiClientTokenAuth(token).post(`/recipes/${recipeId}/instructions`, i)))}

        if (deletedIds2.length>0){
        data6 = await Promise.all(deletedIds2.map(i => apiClientTokenAuth(token).delete(`/recipes/instructions/${i}`)))}
    }
    return [ data, data1, data2, data3, data4, data5, data6, error ]
}

//request to delete recipe
async function deleteRecipeById(token:string, recipeId:string|number) {
    let data;
    let error;
    try{
        const response = await apiClientTokenAuth(token).delete(recipeEndpoint + '/' + recipeId)
        data = response.data.success
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data?.error || `Recipe with ID ${recipeId} does not exist`
        } else {
            error = 'Something went wrong'
        }
    }
    return { data, error }
}

//recipe to record when a user saves another user's recipe, recorded as save on original recipe
async function sendSave (token:string, recipeId:string|number) {
    let data;
    let error;
    try {
        const response = await apiClientTokenAuth(token).post(recipeEndpoint+`/${recipeId}/save`)
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data?.error || `Recipe with ID ${recipeId} does not exist`
        } else {
            error = 'Something went wrong'
        }
    }
    return { data, error }
}

//request for recipes from sesarch term
async function apiSearch (search: string): Promise<APIResponse<apiResponseType>>{
    let data;
    let error;
    try{
        //search term added to end of url request as required by the API
        const response = await apiFoodNoAuth().get(`/search.php?key=1&s=${search}`)
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data?.error || `Recipes for ${search} were not found`
        } else {
            error = 'Something went wrong'
        }
    }
    return { data, error }
}

//export all requests to be used in appropriate forms
export {
    login,
    register,
    getMe,
    getAllRecipes,
    getRecipeById,
    createRecipe,
    deleteRecipeById,
    editRecipeById,
    sendSave,
    apiSearch
}