import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'

import { RecipeType, RecipeFormDataType } from '../types';
import { createRecipe } from '../lib/apiWrapper';


type RecipeCardProps = {
    recipe: RecipeType,
    fetchDataRecipeChild: ()=>void
}

export default function RecipeCard({ recipe, fetchDataRecipeChild }: RecipeCardProps) {
    
    let currentUser= JSON.parse(localStorage.getItem('currentUser')!)

    const saveRecipe = async (recipe: RecipeFormDataType) => {
        const saveRecipe: RecipeFormDataType = {
            name: recipe.name,
            description:recipe.description,
            cuisine: recipe.cuisine,
            cookTime:recipe.cookTime,
            servings: recipe.servings,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions
        }
    
        const token=localStorage.getItem('token') || ''
            const response = await createRecipe(token, saveRecipe)
            if (response.error){
                console.log(response.error)
            } else if (response.data){
                console.log(response.data)
                fetchDataRecipeChild()
            }
    }

    return (
        <Card className='my-3 bg-custom' text='black'>
            <Card.Header>{ recipe.cookTime }</Card.Header>
            <Card.Body>
                <Card.Title>{ recipe.name }</Card.Title>
                <Card.Subtitle>{ recipe.servings }</Card.Subtitle>
                <Card.Text>{ recipe.ingredients }</Card.Text>
                <Card.Text>{ recipe.instructions }</Card.Text>
                <Card.Footer>{`By: ${recipe.author.username}    |    id:${recipe.id}`}</Card.Footer>
            </Card.Body>
            {recipe.author.id !== currentUser.id ? <Container className ="d-flex justify-content-center"><Button className='button-size' onClick = {() => saveRecipe(recipe)}>Save recipe</Button></Container>: <></>}
        </Card>
    )
}
