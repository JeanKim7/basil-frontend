import axios from 'axios';
import { UserType, UserFormDataType, TokenType, RecipeType, RecipeFormDataType, apiResponseType, IngredientType, IngredientFormType, InstructionType, InstructionFormType } from '../types';

const baseURL = 'https://project-basil-database.onrender.com'
const userEndpoint = '/users'
const recipeEndpoint = '/recipes'
const tokenEndpoint = '/token'

const apiURL = 'https://www.themealdb.com/api/json/v1/1'



const apiClientNoAuth = () => axios.create({
    baseURL: baseURL
})

const apiClientBasicAuth = (username:string, password:string) => axios.create({
    baseURL: baseURL,
    headers: {
        Authorization: 'Basic ' + btoa(username + ':' + password)
    }
})

const apiClientTokenAuth = (token:string) => axios.create({
    baseURL: baseURL,
    headers: {
        Authorization: 'Bearer ' + token
    }
})

const apiFoodNoAuth = () => axios.create({
    baseURL: apiURL
})

type APIResponse<T> = {
    data?: T,
    error?: string
}

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
    if (data) {
        const response1 = await apiClientNoAuth().get(`/recipes/${recipeId}/ingredients`);
        data1=response1.data;
        const response2= await apiClientNoAuth().get(`/recipes/${recipeId}/instructions`);
        data2=response2.data
    }
    return [data, data1, data2, error]
}

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

async function apiSearch (search: string): Promise<APIResponse<apiResponseType>>{
    let data;
    let error;
    try{
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