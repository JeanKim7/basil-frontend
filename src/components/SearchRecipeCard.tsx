import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'

import {  RecipeFormDataType } from '../types';
import { createRecipe } from '../lib/apiWrapper';



type SearchRecipeCardProps = {
    recipe: RecipeFormDataType
}

const saveRecipe = async (recipe: RecipeFormDataType) => {
    const saveRecipe: RecipeFormDataType = {
        name: recipe.name,
        description:recipe.description,
        cuisine: recipe.cuisine,
        cookTime:recipe.cookTime,
        servings: recipe.servings,
    }

    const token=localStorage.getItem('token') || ''
        const response = await createRecipe(token, saveRecipe)
        if (response.error){
            console.log(response.error)
        } else if (response.data){
            console.log(response.data)
        }
}



export default function SearchRecipeCard({ recipe }: SearchRecipeCardProps) {
    
    return (
        <Card className='my-3'>
            <Card.Header>{ recipe.cookTime }</Card.Header>
            <Card.Body>
                <Card.Title>{ recipe.name }</Card.Title>
                <Card.Subtitle>{ recipe.servings }</Card.Subtitle>
                <Card.Text>{ recipe.ingredients }</Card.Text>
                <Card.Text>{ recipe.instructions }</Card.Text>
            </Card.Body>
            <Button onClick={() => saveRecipe(recipe)}>Save recipe</Button>
        </Card>
    )
}