import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import ListGroup from 'react-bootstrap/ListGroup';

import {  IngredientFormType, InstructionFormType, RecipeFormDataType } from '../types';
import { createRecipe } from '../lib/apiWrapper';



type SearchRecipeCardProps = {
    recipe: RecipeFormDataType,
    ingredients: IngredientFormType[],
    instructions: InstructionFormType[]
}

export default function SearchRecipeCard({ recipe, ingredients, instructions }: SearchRecipeCardProps) {
    
    const navigate = useNavigate()

    //function to convert data from one API search recipe into appropriate forms 
    const saveRecipe = async (recipe: RecipeFormDataType) => {
        const saveRecipe: RecipeFormDataType = {
            name: recipe.name,
            description:recipe.description,
            cuisine: recipe.cuisine,
            cookTime: recipe.cookTime,
            servings: recipe.servings,
        }
        
        //save each ingredient and store in list
        const saveIngredients: IngredientFormType[] = []
        for (let i of ingredients) {
            saveIngredients.push({
                name: i.name,
                quantity: i.quantity,
                unit: i.unit
            })
        }

        //save each instruction and store in a list
        const saveInstructions: InstructionFormType[] = []
        for (let i of instructions) {
            saveInstructions.push({
                stepNumber: `${i.stepNumber}`,
                body: i.body
            })
        }

        //retrieve token and create recipe using API wrapper
        const token=localStorage.getItem('token') || ''
            const response = await createRecipe(token, saveRecipe, saveIngredients, saveInstructions)
            if (response.error){
                console.log(response.error)
            } else if (response.data){
                console.log(response.data)
                navigate('/myRecipes')
            }
    }

    //component shows info of one recipe from search query on a card, ingredients and instructions mapped onto a table
    return (
        <>
            <Card className='my-3'>
                <Card.Header>{ recipe.cookTime }</Card.Header>
                <Card.Body>
                    <Card.Title>{ recipe.name }</Card.Title>
                    <Card.Subtitle>{ recipe.servings }</Card.Subtitle>
                </Card.Body>
                <Button onClick={() => saveRecipe(recipe)}>Save recipe</Button>
            </Card>

            <h1>Ingredients</h1>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Units</th>
                    </tr>
                </thead>
                <tbody>
                    {ingredients.map((i)=>
                    <tr>
                        <th>{i.name}</th>
                        <th>{i.quantity}</th>
                        <th>{i.unit}</th>
                    </tr>
                    )}
                </tbody>
            </Table>

            <h1>Instructions</h1>
            <ListGroup>
                {instructions.map((i)=>
                    <ListGroup.Item>{`${i.stepNumber}. ${i.body}`}</ListGroup.Item>
                )}
            </ListGroup>
        </>
    )
}