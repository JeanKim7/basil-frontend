import {useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'

import { RecipeFormDataType, IngredientFormType, InstructionFormType } from '../types';
import {createRecipe} from '../lib/apiWrapper';


export default function CreateRecipeForm() {

    const navigate = useNavigate()

    const [recipe, setRecipe] = useState<RecipeFormDataType>({
        name: '',
        description: '',
        cuisine: "",
        cookTime: "",
        servings: ''
        }
    )

    const handleCreateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRecipe({...recipe, [event.target.name]:event.target.value})
    }
    
    const [ingredients, setIngredients] = useState<IngredientFormType[]>([
        {name: '',
        quantity: "",
        unit: ""
        }
    ])

    function handleIngreInputChange (index: number, event) {
        const {name, value} = event.target
        const updatedIngredients = [...ingredients]
        updatedIngredients[index] = {...updatedIngredients[index], [name]:value}
        setIngredients(updatedIngredients)
    }

    const newIngred = () => {
        setIngredients([...ingredients,{
        name: '',
        quantity: "",
        unit: ""
        }])
    }

    const removeIngred = (index: number) => {
        const updatedIngredients = [...ingredients]
        updatedIngredients.splice(index,1)
        setIngredients(updatedIngredients)
    }

    const [instructions, setInstructions] = useState<InstructionFormType[]>([
        {stepNumber: "",
        body: ""
        }
    ]
    )

    function handleStepInputChange(index:number, event) {
        const {name, value}= event.target
        const updatedInstructions = [...instructions]
        updatedInstructions[index] = {...updatedInstructions[index], [name]:value}
        updatedInstructions[index].stepNumber = `${index+1}`
        setInstructions(updatedInstructions)
    }

    const newStep = () => {
        setInstructions([...instructions, {
            stepNumber: "",
            body:""
        }])
    }

    const removeStep =(index:number) => {
        const updatedInstructions=[...instructions]
        updatedInstructions.splice(index, 1)
        setInstructions(updatedInstructions)
    }

    

    const handleCreateFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const token=localStorage.getItem('token') || ''
        const response = await createRecipe(token, recipe, ingredients, instructions)
        if (response.error){
            console.log(response.error)
        } else if (response.data){
            console.log(response.data)
            navigate('/Home')
        }
    }


    return (
        <>
            <Card className= 'my-1 p-3 recipe-input'>
                <Form onSubmit={handleCreateFormSubmit}>
                    <Form.Label htmlFor="name">Name of Your Recipe</Form.Label> 
                    <Form.Control name="name" placeholder="Enter a name for your recipe" value= {recipe.name} onChange={handleCreateInputChange} />

                    <Form.Label htmlFor="description">Description</Form.Label> 
                    <Form.Control name="description" placeholder="Enter a description for your recipe" value= {recipe.description} onChange={handleCreateInputChange} />

                    <Form.Label htmlFor="cuisine">Cuisine</Form.Label>
                    <Form.Control name="cuisine" placeholder="Enter the cuisine type of your recipe" value= {recipe.cuisine} onChange={handleCreateInputChange} />

                    <Form.Label htmlFor="cookTime">Cooking Time</Form.Label>
                    <Form.Control name="cookTime" placeholder="Enter the time it will take to make your recipe" value= {recipe.cookTime} onChange={handleCreateInputChange} />

                    <Form.Label htmlFor="servings">Servings</Form.Label>
                    <Form.Control name="servings" placeholder="Enter the servings your recipe will make" value= {recipe.servings} onChange={handleCreateInputChange} />


                    <div>
                        <Button onClick = {newIngred}>Add Ingredients</Button>
                        
                        {ingredients?.map((i, index) => 
                            <div key={index}>
                            <h5>Ingredient {index+1}</h5>
                            <Form.Label htmlFor='name'>Ingredient Name</Form.Label>
                            <Form.Control name="name" placeholder="Enter the name of the ingredient" value = {i.name} onChange={(event) =>handleIngreInputChange(index, event)}/>
                            
                            <Form.Label htmlFor='quantity'>Quantity</Form.Label>
                            <Form.Control name="quantity" placeholder="Enter the quantity of the ingredient" value = {i.quantity} onChange={(event)=>handleIngreInputChange(index, event)}/>

                            <Form.Label htmlFor="unit">Units for Quantity</Form.Label>
                            <Form.Control name="unit" placeholder="Enter the unit for the ingredient" value = {i.unit} onChange={(event) =>handleIngreInputChange(index, event)}/>
                            <Button onClick = {()=>removeIngred(index)}>Remove Ingredient</Button>
                            </div>
                        )}
                    </div>

                    <div>
                        <Button onClick = {newStep}>Add Step</Button>
                        {instructions?.map((i, index) => 
                        <div key={index}>
                            <h5>Step {index+1}</h5>                            
                            <Form.Control name="body" placeholder="Enter what to do for this step" value = {i.body} onChange={(event)=>handleStepInputChange(index, event)}/>
                            <Button onClick = {()=>removeStep(index)}>Remove Step</Button>
                            
            
                        </div>
                        )}
                    </div>



                    <Container className ="d-flex justify-content-center">
                        <Button type='submit' className='button-size'>Create Recipe</Button>
                    </Container>
                </Form>
            </Card>
        </>
    )
}
      