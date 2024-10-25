import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import ListGroup from 'react-bootstrap/ListGroup'

import { RecipeType,IngredientType, IngredientFormType, InstructionType, InstructionFormType, RecipeFormDataType } from '../types';
import { createRecipe, sendSave } from '../lib/apiWrapper';


type RecipeCardProps = {
    recipe: RecipeType,
    ingredients: IngredientType[],
    instructions: InstructionType[],
    fetchDataRecipeChild: ()=>void,

}

export default function RecipeCard({ recipe, ingredients, instructions, fetchDataRecipeChild }: RecipeCardProps) {
    
    const navigate = useNavigate()

    let currentUser= JSON.parse(localStorage.getItem('currentUser')!)

    let ID = recipe.id
    //save recipes made by other users into user's own collection
    //change data into forms to be submitted
    const saveRecipe = async (recipe: RecipeFormDataType) => {
        const saveRecipe: RecipeFormDataType = {
            name: recipe.name,
            description:recipe.description,
            cuisine: recipe.cuisine,
            cookTime: recipe.cookTime,
            servings: recipe.servings,
        }
        
        const saveIngredients: IngredientFormType[] = []
        for (let i of ingredients) {
            saveIngredients.push({
                name: i.name,
                quantity: i.quantity,
                unit: i.unit
            })
        }

        const saveInstructions: InstructionFormType[] = []
        for (let i of instructions) {
            saveInstructions.push({
                stepNumber: `${i.stepNumber}`,
                body: i.body
            })
        }
        
        //user token and form data to send a request to create new recipe for user
        const token=localStorage.getItem('token') || ''
        const response1 = await sendSave(token, ID)
        if (response1.error){
            console.log(response1.error)
        } else if (response1.data){
            console.log(response1.data)
            const response = await createRecipe(token, saveRecipe, saveIngredients, saveInstructions)
                if (response.error){
                    console.log(response.error)
                } else if (response.data){
                    console.log(response.data)
                }
            fetchDataRecipeChild()
            navigate('/myRecipes')
        }
        
    }


    //shows one recipe in detail that has been made by another user
    return (
        <>
        <Card className='my-3 bg-custom' text='black'>
            <Card.Header>{ recipe.name }</Card.Header>
            <Card.Body>
                <Card.Subtitle>{ recipe.description }</Card.Subtitle>
                <Card.Subtitle>{ recipe.servings }</Card.Subtitle>

                <Card.Footer className= "recipe-card-footer"><div className='foot1'>{`By: ${recipe.author.username}`}</div><div className='foot2'>{`id:${recipe.id}`}</div></Card.Footer>
            </Card.Body>
            {recipe.author.id !== currentUser.id ? <Container className ="d-flex justify-content-center"><Button className='button-size' onClick = {() => saveRecipe(recipe)}>Save recipe</Button></Container>: <></>}
        </Card>
        {/*list ingredients*/}
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
        {/*list instructions*/}
        <h1>Instructions</h1>
        <ListGroup>
            {instructions.map((i)=>
                <ListGroup.Item>{`${i.stepNumber}. ${i.body}`}</ListGroup.Item>
            )}
        </ListGroup>
        </>
    )
}
