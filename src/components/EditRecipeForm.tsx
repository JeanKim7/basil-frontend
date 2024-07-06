import {useState, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'

import { RecipeFormDataType, RecipeType, IngredientType, InstructionType } from '../types';
import {editRecipeById} from '../lib/apiWrapper';

type EditRecipeFormProps = {
    recipe: RecipeType,
    // ingredients: IngredientType[],
    // instructions: InstructionType[]
}
//, ingredients, instructions
export default function EditRecipeForm({ recipe }: EditRecipeFormProps){

    const navigate = useNavigate()
    
    const [editRecipeData, setEditRecipeData] = useState<Partial<RecipeType>>(recipe)
    // const [editIngredientsData, setEditIngredientsData] = useState<Partial<IngredientType>[]>(ingredients)
    // const [editInstructionsData, setEditInstructionsData] = useState<Partial<InstructionType>[]>(instructions)


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditRecipeData({...editRecipeData, [event.target.name]:event.target.value})
    }

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const token=localStorage.getItem('token') || ''
        const response = await editRecipeById(token, recipe.id, editRecipeData)
        if (response.error){
            console.log(response.error)
        } else if (response.data){
            console.log(response.data)
            navigate('/Home')
        }
    }

    console.log("form", editRecipeData)


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
                <Container className ="d-flex justify-content-center">
                    <Button type='submit' className='button-size'>Edit Recipe</Button>
                </Container>
            </Form>
        </Card>
       )

}