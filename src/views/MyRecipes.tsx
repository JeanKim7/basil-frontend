import {useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Accordion from 'react-bootstrap/Accordion';

import { RecipeFormDataType, Ingredient } from '../types';
import { createRecipe, editRecipeById, deleteRecipeById } from '../lib/apiWrapper';

export default function MyRecipes() {

    const navigate = useNavigate()

    const [editRecipeData, setEditRecipeData] = useState<Partial<RecipeFormDataType>>({})
    const [editRecipeID, setEditRecipeID] = useState<string>('')
    const [deleteRecipeID, setDeleteRecipeID]= useState<string>('')
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
    
    //Using a list of ingredient objects to keep trak of input for each form =================

    const [ingredients, setIngredients] = useState<Ingredient[]>([
        {name: '',
        quantity: 0,
        unit: ""
        }
    ])

    //trying to create a use state in a list for each form that is created
    function handleIngreInputChange (index: number, event: React.ChangeEvent<HTMLInputElement>) {
        let data = [...ingredients]
        data[index][event.target.name] = event?.target.value
        setIngredients(data)
    }

    //Stop checking here===================================

    const handleCreateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRecipe({...recipe, [event.target.name]:event.target.value})
    }

    const handleCreateFormSubmit = async (event: React.FormEvent) => {
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

            <Accordion className='mt-3 accord1' id='input-accord'>
                <Accordion.Item className='accord1' eventKey='0'>
                    <Accordion.Header className='accord1'>Create a New Recipe</Accordion.Header>
                    <Accordion.Body>
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

                                {//Check here Travis!============================}
}
                                <div>
                                <Button>Add Ingredients</Button>
                                {ingredients?.map((i, index) => 
                                    <>
                                    <Form.Control key={index} name="name" placeholder="Enter the name of the ingredient" value = {ingredients[index].name} onChange={handleIngreInputChange(index, event)}/>

                                    <Form.Control key={index} name="quantity" placeholder="Enter the quantity of the ingredient" value = {ingredients[index].quantity} onChange={handleIngreInputChange(index, e)}/>

                                    <Form.Control key={index} name="unit" placeholder="Enter the unit for the ingredient" value = {ingredients[index].unit} onChange={handleIngreInputChange(index, e)}/>
                                    </>
                                )}
                                </div>

                                {//Stop here!============================}
}

                                <Form.Label htmlFor="instructions">Instructions</Form.Label>
                                <Form.Control as= "textarea" name="instructions" placeholder="Enter the Instructions for your recipe" value= {recipe.instructions} onChange={handleCreateInputChange} />
                                
                                <Container className ="d-flex justify-content-center">
                                <Button type='submit' className='button-size'>Create Recipe</Button>

                                </Container>
                            </Form>
                        </Card>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item className='accord1' eventKey='1'>
                    <Accordion.Header>Edit a Recipe</Accordion.Header>
                    <Accordion.Body>
                        <Card className ='my-1 p-3 recipe-input'>
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
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item className='accord1' eventKey='2'>
                    <Accordion.Header className='accord1'>Delete a Recipe</Accordion.Header>
                    <Accordion.Body>
                        <Card className ='my-1 p-3 recipe-input'>
                            <Form onSubmit = {handleDeleteFormSubmit}>
                                <Form.Label htmlFor="deleteRecipeID">What is the ID of the recipe you want to delete?</Form.Label>
                                <Form.Control name="deleteRecipeID" placeholder="Enter the recipe ID" value = {deleteRecipeID} onChange = {handleInputChangeDelete}></Form.Control> 
                                
                                <Container className ="d-flex justify-content-center">
                                    <Button variant="danger" type="submit" className='button-size'>Delete Recipe</Button>
                                </Container>
                            </Form>
                        </Card>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    )
}