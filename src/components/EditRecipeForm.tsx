import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'

import { RecipeType, IngredientType, IngredientFormType, InstructionType, InstructionFormType } from '../types';
import {editRecipeById} from '../lib/apiWrapper';

type EditRecipeFormProps = {
    recipe: RecipeType,
    ingredients: IngredientType[],
    instructions: InstructionType[]
}

//form to edit recipe by editing, adding or removing ingredients or instructions 
export default function EditRecipeForm({ recipe, ingredients, instructions }: EditRecipeFormProps){

    const navigate = useNavigate()
    
    //set useStates for edited recipes
    const [editRecipeData, setEditRecipeData] = useState<Partial<RecipeType>>(recipe)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditRecipeData({...editRecipeData, [event.target.name]:event.target.value})
    }

    //set useStates for edited ingredients and ID of removed ingredients
    const [editIngredients, setEditIngredients] = useState<Partial<IngredientType>[]>(ingredients)

    const[removedIngredients, setRemovedIngredients] = useState<number[]>([])

    //gave event in parameters "any" type because when type is defined in function below, it's not compatible with type in returned element at bottom of file, will have to change typescript configuration to "allow implicit any"
    
    //add index for each ingredient edited to keep track of which ingredient is edited
    function handleEditIngreInputChange (index: number, event) {
        const {name, value} = event.target
        const updatedIngredients = [...editIngredients]
        updatedIngredients[index] = {...updatedIngredients[index], [name]:value}
        setEditIngredients(updatedIngredients)
    }

    //give new ingredients id of -1 to later identify and create new ingredient
    const newIngred = () => {
        setEditIngredients([...editIngredients,{
        id: -1,
        name: '',
        quantity: "",
        unit: ""
        }])
    }

    const removeIngred = (index: number) => {
        const updatedIngredients = [...editIngredients]
        let removedId = updatedIngredients[index].id

        updatedIngredients.splice(index,1)
        setEditIngredients(updatedIngredients)

        const updatedIngredients1 = [...removedIngredients]
        updatedIngredients1.push(removedId as number)
        setRemovedIngredients(updatedIngredients1)
    }

    const [editInstructions, setEditInstructions] = useState<Partial<InstructionType>[]>(instructions)

    const[removedInstructions, setRemovedInstructions] = useState<number[]>([])

    function handleStepChange(index:number, event) {
        const {name, value}= event.target
        const updatedInstructions = [...editInstructions]
        updatedInstructions[index] = {...updatedInstructions[index], [name]:value}
        updatedInstructions[index].stepNumber = `${index+1}`
        setEditInstructions(updatedInstructions)
    }

    const newStep = () => {
        setEditInstructions([...editInstructions, {
            id: -1,
            stepNumber: `${editInstructions.length+1}`,
            body:""
        }])


    }

    const removeStep =(index:number) => {
        const updatedInstructions=[...editInstructions]
        let removedStepId= updatedInstructions[index].id

        updatedInstructions.splice(index, 1)
        setEditInstructions(updatedInstructions)

        const updatedInstructions1= [...removedInstructions]
        updatedInstructions1.push(removedStepId as number)
        setRemovedInstructions(updatedInstructions1)
    }

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const token=localStorage.getItem('token') || ''

        let editIngData: Partial<IngredientType>[] = []
        let newIngData: Partial<IngredientFormType>[] = []
        
        for (let i of editIngredients) {
            if (i.id == -1){
                newIngData.push({
                    name: i.name,
                    quantity: i.quantity,
                    unit: i.unit
                })
            } else {
                editIngData.push(i)
            }
        }

        let editInsData: Partial<InstructionType>[] = []
        let newInsData: Partial<InstructionFormType>[]= []

        for (let i of editInstructions) {
            if (i.id == -1){
                newInsData.push({
                    stepNumber: i.stepNumber,
                    body: i.body
                })
            } else {
                editInsData.push(i)
            }
        }

        const response = await editRecipeById(token, recipe.id, editRecipeData, editIngData, newIngData, removedIngredients, editInsData, newInsData, removedInstructions )
        if (response[7]){
            console.log(response[7], "error")
        } else if (response[1]){
            console.log(response[1], "successfully deleted")
            navigate('/Home')
        }
    }



    return (
       <Card className ='my-1 p-3 recipe-input'>
            <Form onSubmit={handleFormSubmit}>

                <Form.Label htmlFor="name">Name of Your Recipe</Form.Label> 
                <Form.Control name="name" placeholder="Enter a name for your recipe" value= {editRecipeData.name} onChange={handleInputChange} />

                <Form.Label htmlFor="description">Description</Form.Label> 
                <Form.Control name="description" placeholder="Enter a description for your recipe" value= {editRecipeData.description} onChange={handleInputChange} />

                <Form.Label htmlFor="cuisine">Cuisine</Form.Label>
                <Form.Control name="cuisine" placeholder="Enter the cuisine type of your recipe" value= {editRecipeData.cuisine} onChange={handleInputChange} />

                <Form.Label htmlFor="cookTime">Cooking Time</Form.Label>
                <Form.Control name="cookTime" placeholder="Enter the time it will take to make your recipe" value= {editRecipeData.cookTime} onChange={handleInputChange} />

                <Form.Label htmlFor="servings">Servings</Form.Label>
                <Form.Control name="servings" placeholder="Enter the servings your recipe will make" value= {editRecipeData.servings} onChange={handleInputChange} />

                <div>
                        <Button onClick = {newIngred}>Add Ingredients</Button>
                        
                        {editIngredients?.map((i, index) => 
                            <div key={index}>
                            <h5>Ingredient {index+1}</h5>
                            <Form.Label htmlFor='name'>Ingredient Name</Form.Label>
                            <Form.Control name="name" placeholder="Enter the name of the ingredient" value = {i.name} onChange={(event) =>handleEditIngreInputChange(index, event)}/>
                            
                            <Form.Label htmlFor='quantity'>Quantity</Form.Label>
                            <Form.Control name="quantity" placeholder="Enter the quantity of the ingredient" value = {i.quantity} onChange={(event)=>handleEditIngreInputChange(index, event)}/>

                            <Form.Label htmlFor="unit">Units for Quantity</Form.Label>
                            <Form.Control name="unit" placeholder="Enter the unit for the ingredient" value = {i.unit} onChange={(event) =>handleEditIngreInputChange(index, event)}/>
                            <Button onClick = {()=>removeIngred(index)}>Remove Ingredient</Button>
                            </div>
                        )}
                </div>

                <div>
                    <Button onClick = {newStep}>Add Step</Button>
                    {editInstructions?.map((i, index) => 
                    <div key={index}>
                        <h5>Step {index+1}</h5>                            
                        <Form.Control name="body" placeholder="Enter what to do for this step" value = {i.body} onChange={(event)=>handleStepChange(index, event)}/>
                        <Button onClick = {()=>removeStep(index)}>Remove Step</Button>
                        
        
                    </div>
                    )}
                </div>

                <Container className ="d-flex justify-content-center">
                    <Button type='submit' className='button-size'>Edit Recipe</Button>
                </Container>
            </Form>
        </Card>
       )

}