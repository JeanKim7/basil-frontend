import {useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'

import { RecipeFormDataType } from '../types';
import { editRecipeById, deleteRecipeById } from '../lib/apiWrapper';

export default function MyRecipes() {

    const navigate = useNavigate()

    const [editRecipeData, setEditRecipeData] = useState<Partial<RecipeFormDataType>>({})
    const [editRecipeID, setEditRecipeID] = useState<string>('')
    const [deleteRecipeID, setDeleteRecipeID]= useState<string>('')

    const handleInputChangeEditRecipeID = (event:React.ChangeEvent<HTMLInputElement>) => {
        setEditRecipeID(event.target.value)
    }
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditRecipeData({...editRecipeData, [event.target.name]:event.target.value})
    }

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const token=localStorage.getItem('token') || ''
        const response = await editRecipeById(token, editRecipeID, editRecipeData)
        if (response.error){
            console.log(response.error)
        } else if (response.data){
            console.log(response.data)
            navigate('/Home')
        }
    }

    const handleInputChangeDelete = (event:React.ChangeEvent<HTMLInputElement>) => {
        setDeleteRecipeID(event.target.value)
    }
    
    const handleDeleteFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const token=localStorage.getItem('token') || ''
        const response = await deleteRecipeById(token, deleteRecipeID)
        if (response.error){
            console.log(response.error)
        } else if (response.data){
            console.log(response.data)
            navigate('/Home')
        }
    }




    return (
        <>

        
            <Card className ='my-5 p-3 recipe-input'>

            <h1 className = "text-center my-3">Edit a Recipe</h1>
                <Form onSubmit={handleFormSubmit}>
                    <Form.Label htmlFor='recipeID'>Recipe ID</Form.Label>
                    <Form.Control name = "recipeID" placeholder="Enter the ID of the recipe you want to edit" value= {editRecipeID} onChange = {handleInputChangeEditRecipeID}></Form.Control>

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

                    <Form.Label htmlFor="ingredients">Ingredients</Form.Label>
                    <Form.Control as= "textarea" name="ingredients" placeholder="Enter the Ingredients for your recipe" value= {editRecipeData.ingredients} onChange={handleInputChange} />

                    <Form.Label htmlFor="instructions">Instructions</Form.Label>
                    <Form.Control as= "textarea" name="instructions" placeholder="Enter the Instructions for your recipe" value= {editRecipeData.instructions} onChange={handleInputChange} />
                    <Container className ="d-flex justify-content-center">
                        <Button type='submit' className='button-size'>Edit Recipe</Button>
                    </Container>
                </Form>
            </Card>
            <Card className ='my-5 p-3 recipe-input'>
            <h1 className = "text-center my-3">Delete a Recipe</h1>
                <Form onSubmit = {handleDeleteFormSubmit}>
                    <Form.Label htmlFor="deleteRecipeID">What is the ID of the recipe you want to delete?</Form.Label>
                    <Form.Control name="deleteRecipeID" placeholder="Enter the recipe ID" value = {deleteRecipeID} onChange = {handleInputChangeDelete}></Form.Control> 
                    
                    <Container className ="d-flex justify-content-center">
                        <Button variant="danger" type="submit" className='button-size'>Delete Recipe</Button>
                    </Container>
                </Form>
            </Card>
        </>
    )
}