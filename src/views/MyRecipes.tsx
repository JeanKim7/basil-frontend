import {useState, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table'

import RecipeCard from '../components/RecipeCard';
import CreateRecipeForm from '../components/CreateRecipeForm';
import EditRecipeForm from '../components/EditRecipeForm';
import { getAllRecipes, getRecipeById, deleteRecipeById } from '../lib/apiWrapper';

import { UserType, RecipeType, IngredientType, InstructionType } from '../types';

type MyRecipesProps = {
    currentUser: UserType | null,
}

export default function MyRecipes({currentUser}: MyRecipesProps) {

    const navigate = useNavigate()

    const [recipes, setRecipes] = useState<RecipeType[]>([])
    const [ingredients, setIngredients] = useState<IngredientType[]>([])
    const [instructions, setInstructions] = useState<InstructionType[]>([])
    const [fetchRecipeData, setFetchRecipeData] = useState(true);

    const [editRecipe, setEditRecipe] = useState<RecipeType>({} as RecipeType)


    const [view, setView] = useState(true)
    const [viewID, setViewID] = useState<Number>(0)

    const fetchDataRecipeChild = () => {setFetchRecipeData(!fetchRecipeData)}

    const hideTable = async (event: React.MouseEvent<HTMLButtonElement>) => {
        setView(false);
        setViewID(+event.currentTarget.id)
        const recipeData = await getRecipeById(+event.currentTarget.id)
        console.log(recipeData)
        let sortedInstructions = recipeData[2].sort((a: InstructionType,b:InstructionType )=>(+a.stepNumber)-(+b.stepNumber))
        setEditRecipe(recipeData[0])
        setIngredients(recipeData[1])
        setInstructions(sortedInstructions)   
    }

    const showTable = () => {
        setView(true)
        setViewID(0)
        setIngredients([])
        setInstructions([])
        setEditRecipe({} as RecipeType)
    }

    useEffect(() => {
        
        async function fetchData(){
            const response = await getAllRecipes();
                if (response.data){
                console.log(response.data)
                let recipes = response.data;
                recipes.sort( (a, b) => (new Date(a.dateCreated) > new Date(b.dateCreated) ? -1 : 1) );
                setRecipes(recipes)
                
            }
        }
        fetchData()
    }, [fetchRecipeData])
    
    const [deleteRecipeID, setDeleteRecipeID]= useState<string>('')

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


    console.log(editRecipe)

    return (
        <>

            <Accordion className='mt-3 accord1' id='input-accord'>

                <Accordion.Item className='accord1' eventKey='0'>
                    <Accordion.Header className='accord1'>Create a New Recipe</Accordion.Header>
                    <Accordion.Body>
                        <CreateRecipeForm/>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item className='accord1' eventKey='1'>
                    <Accordion.Header>Edit a Recipe</Accordion.Header>
                    <Accordion.Body>
                        <div key={editRecipe.id}>
                        <EditRecipeForm recipe={editRecipe}
                        // ingredients = {ingredients} instructions = {instructions}
                        />
                        </div>
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

            <div style={{display: view ? "": "none"}}>
                <h1 className = "text-center mb-4"> My Recipes</h1>
                <Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Recipe Name</th>
                            <th>Saves</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {recipes && Array.isArray(recipes) && currentUser && recipes?.filter(r => r.author.id ===currentUser?.id).map(r => 
                        <tr>
                            <td>{r.id}</td>
                            <td>{r.name}</td>
                            <td></td>
                            <td><Button onClick={hideTable} id={`${r.id}`}>View Recipe</Button></td>
                        </tr>)}
                    </tbody>
                </Table>
            </div>

            <div style={{display: view ? "none": ""}}>
                {recipes?.filter(r => r.id === viewID).map(r => <RecipeCard key={String(viewID)} recipe = {r} ingredients={ingredients} instructions = {instructions} fetchDataRecipeChild={fetchDataRecipeChild}/>)}
                <Button onClick={showTable}>View Other Recipes</Button>
            </div>
        </>
    )
}