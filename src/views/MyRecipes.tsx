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

    //set useStates for recipes, their ingredients and instructions for when they are fetched from database
    const [recipes, setRecipes] = useState<RecipeType[]>([])
    const [ingredients, setIngredients] = useState<IngredientType[]>([])
    const [instructions, setInstructions] = useState<InstructionType[]>([])
    const [fetchRecipeData, setFetchRecipeData] = useState(true);

    //useState for editing recipe inputs
    const [editRecipe, setEditRecipe] = useState<RecipeType>({} as RecipeType)

    //useStates for viewing one recipe in particular
    const [view, setView] = useState(true)
    const [viewID, setViewID] = useState<number>(0)

    //useState to rerender page when specific recipe needs to be viewed
    const fetchDataRecipeChild = () => {setFetchRecipeData(!fetchRecipeData)}

    //hide table of all ecipes when viewing one recipe
    const hideTable = async (event: React.MouseEvent<HTMLButtonElement>) => {
        setView(false);
        //store ID of single recipe that is being viewed, use to fetch from databse
        setViewID(+event.currentTarget.id)
        const recipeData = await getRecipeById(+event.currentTarget.id)
        console.log(recipeData)
        let sortedInstructions = recipeData[2].sort((a: InstructionType,b:InstructionType )=>(+a.stepNumber)-(+b.stepNumber))
        //set fetched Recipe into useState variables
        setEditRecipe(recipeData[0])
        setIngredients(recipeData[1])
        setInstructions(sortedInstructions)   
    }

    //show all recipes after leaving view of one recipe
    const showTable = () => {
        setView(true)
        setViewID(0)
        setIngredients([])
        setInstructions([])
        setEditRecipe({} as RecipeType)
    }

    //make sure all recipes are fetched when page is first loaded and after very re-render
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
                {/*store create, edit and delete recipe in different accordion sections*/}
                <Accordion.Item className='accord1' eventKey='0'>
                    <Accordion.Header className='accord1'>Create a New Recipe</Accordion.Header>
                    <Accordion.Body>
                        {/*use separate element in components folder*/}
                        <CreateRecipeForm/>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item className='accord1' eventKey='1'>
                    <Accordion.Header>Edit a Recipe</Accordion.Header>
                    <Accordion.Body>
                        <div key={editRecipe.id}>
                        {/*use separate element in components folder*/}
                        <EditRecipeForm recipe={editRecipe} ingredients = {ingredients} instructions = { instructions}
                        />
                        </div>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item className='accord1' eventKey='2'>
                    <Accordion.Header className='accord1'>Delete a Recipe</Accordion.Header>
                    <Accordion.Body>
                        {/*use separate element in components folder*/}
                        <DeleteRecipeForm recipeId={viewID}/>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <div style={{display: view ? "": "none"}}>
                <h1 className = "text-center mb-4"> My Recipes</h1>
                {/*put each recipe as a row in a table*/}
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
                            {/*use button to view one recipe in more detail*/}
                            <td><Button onClick={hideTable} id={`${r.id}`}>View Recipe</Button></td>
                        </tr>)}
                    </tbody>
                </Table>
            </div>
            
            <div style={{display: view ? "none": ""}}>
                {/*show selected recipe as a separate card with instructions and ingredients shown*/}
                {recipes?.filter(r => r.id === viewID).map(r => <RecipeCard key={String(viewID)} recipe = {r} ingredients={ingredients} instructions = {instructions} fetchDataRecipeChild={fetchDataRecipeChild}/>)}
                {/*go back to viewing all recipes of this user*/}
                <Button onClick={showTable}>View Other Recipes</Button>
            </div>
        </>
    )
}