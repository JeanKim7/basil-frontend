import {useState, useEffect } from 'react';
import React from 'react';

import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table'

import RecipeCard from '../components/RecipeCard';
import CreateRecipeForm from '../components/CreateRecipeForm';
import EditRecipeForm from '../components/EditRecipeForm';
import DeleteRecipeForm from '../components/DeleteRecipeForm';
import { getAllRecipes, getRecipeById } from '../lib/apiWrapper';

import { UserType, RecipeType, IngredientType, InstructionType } from '../types';

type MyRecipesProps = {
    currentUser: UserType | null,
}

export default function MyRecipes({currentUser}: MyRecipesProps) {

    const [recipes, setRecipes] = useState<RecipeType[]>([])
    const [ingredients, setIngredients] = useState<IngredientType[]>([])
    const [instructions, setInstructions] = useState<InstructionType[]>([])
    const [fetchRecipeData, setFetchRecipeData] = useState(true);

    const [editRecipe, setEditRecipe] = useState<RecipeType>({} as RecipeType)


    const [view, setView] = useState(true)
    const [viewID, setViewID] = useState<number>(0)

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
                recipes.sort( (a, b) => (a.saves > b.saves ? -1 : 1) );
                setRecipes(recipes)
                
            }
        }
        fetchData()
    }, [fetchRecipeData])

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
                        <EditRecipeForm recipe={editRecipe} ingredients = {ingredients} instructions = { instructions}
                        />
                        </div>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item className='accord1' eventKey='2'>
                    <Accordion.Header className='accord1'>Delete a Recipe</Accordion.Header>
                    <Accordion.Body>
                        <DeleteRecipeForm recipeId={viewID}/>
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
                            <td>{r.saves}</td>
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