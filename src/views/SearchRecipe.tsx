import { useState } from "react"

import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container"

import SearchRecipeCard from "../components/SearchRecipeCard"
import { apiSearch } from "../lib/apiWrapper";
import { RecipeFormDataType, apiRecipeType } from "../types";

export default function SearchRecipe (){

    const [searchTerm, setSearchTerm] = useState('')
    const [searchRecipes, setSearchRecipes] = useState<RecipeFormDataType[]>()
    const [showRecipes, setShowRecipes] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }

    const convertApiRecipes = (recipes: apiRecipeType[]) => {
        let convertedRecipes: RecipeFormDataType[] = [] 
        for (let recipe of recipes) {
            let ingredientStr:string = '';
            
            //Make recipe object be indexable by strings to loop through ingredients and add them to the card
            interface IDictionary { [index:string]: string | null}
            let params = {} as IDictionary
            params = recipe

            for (let i=1; i<21; i++){
                if (params[`strIngredient${i}`] === ''){
                    break
                } else {
                    ingredientStr+= (params[`strIngredient${i}`] +' ('+ (params[`strMeasure${i}`]+ '), '))
                }
            }

            let convertedRecipe: RecipeFormDataType = {
                name: recipe.strMeal || '',
                description: '',
                cuisine: recipe.strArea || '',
                cookTime: '',
                servings: '',
                ingredients: ingredientStr.slice(0, (ingredientStr.length-2)),
                instructions: recipe.strInstructions!
            
            }
            convertedRecipes.push(convertedRecipe)
        }
        return convertedRecipes
    }

    const handleFormSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        console.log(searchTerm)

        const response = await apiSearch(searchTerm)
        if (response.error) {
            console.log(response.error)
        } else {
            console.log('success')
            let data = response.data!.meals
            if (data === null) {
                console.log('No matching searches found')
                setShowRecipes(false)
            } else {
            setSearchRecipes(convertApiRecipes(data))
            setShowRecipes(true)
            }
        }
    }

    return(
    <>
        <Container className ="d-flex justify-content-center">
            <Form onSubmit = {handleFormSubmit}>
            
                <Form.Control className="searchbar" value={searchTerm} placeholder='Search Recipes' onChange={handleInputChange} />
                <Container className ="d-flex justify-content-center">
                        <Button className="button-size" type='submit'>Search Recipe</Button>
                </Container>

            </Form>
        </Container>
    {showRecipes ? searchRecipes?.map(r => <SearchRecipeCard key={r.name} recipe={r} />): <></>}
    </>
    )
}