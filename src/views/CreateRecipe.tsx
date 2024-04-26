import {useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'

import { RecipeFormDataType } from '../types';
import { createRecipe } from '../lib/apiWrapper';

export default function CreateRecipe() {

    const navigate = useNavigate()

    const [recipe, setRecipe] = useState<RecipeFormDataType>({
        name: '',
        description: '',
        cuisine: "",
        cookTime: "",
        servings: '',
        ingredients: '',
        instructions: ''
        }
    )

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRecipe({...recipe, [event.target.name]:event.target.value})
    }

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const token=localStorage.getItem('token') || ''
        const response = await createRecipe(token, recipe)
        if (response.error){
            console.log(response.error)
        } else if (response.data){
            console.log(response.data)
            navigate('/')
        }
    }


    return (
        <>

            
        
            <Card className= 'my-5 p-3'>
            <h1 className = "text-center my-3">Create a Recipe</h1>
                <Form onSubmit={handleFormSubmit}>
                    <Form.Label htmlFor="name">Name of Your Recipe</Form.Label> 
                    <Form.Control name="name" placeholder="Enter a name for your recipe" value= {recipe.name} onChange={handleInputChange} />

                    <Form.Label htmlFor="description">Description</Form.Label> 
                    <Form.Control name="description" placeholder="Enter a description for your recipe" value= {recipe.description} onChange={handleInputChange} />

                    <Form.Label htmlFor="cuisine">Cuisine</Form.Label>
                    <Form.Control name="cuisine" placeholder="Enter the cuisine type of your recipe" value= {recipe.cuisine} onChange={handleInputChange} />

                    <Form.Label htmlFor="cookTime">Cooking Time</Form.Label>
                    <Form.Control name="cookTime" placeholder="Enter the time it will take to make your recipe" value= {recipe.cookTime} onChange={handleInputChange} />

                    <Form.Label htmlFor="servings">Servings</Form.Label>
                    <Form.Control name="servings" placeholder="Enter the servings your recipe will make" value= {recipe.servings} onChange={handleInputChange} />

                    <Form.Label htmlFor="ingredients">Ingredients</Form.Label>
                    <Form.Control as= "textarea" name="ingredients" placeholder="Enter the Ingredients for your recipe" value= {recipe.ingredients} onChange={handleInputChange} />

                    <Form.Label htmlFor="instructions">Instructions</Form.Label>
                    <Form.Control as= "textarea" name="instructions" placeholder="Enter the Instructions for your recipe" value= {recipe.instructions} onChange={handleInputChange} />
                    <Container className ="d-flex justify-content-center">
                        <Button type='submit' className='button-size'>Create Recipe</Button>
                    </Container>
                </Form>
            </Card>
        </>
    )
}
      