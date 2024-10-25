import { useState, useEffect } from 'react';

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

import  RecipeCard  from '../components/RecipeCard'
import { UserType, RecipeType, IngredientType, InstructionType } from '../types';
import { getAllRecipes, getRecipeById } from '../lib/apiWrapper';


type HomeProps = {
    currentUser: UserType | null,


}

export default function Home ({currentUser}:HomeProps){

    //home page will show recipes of other users
    //useStates for other users recipes, ingredients and instructions
    const [recipes, setRecipes] = useState<RecipeType[]>([])
    const [ingredients, setIngredients] = useState<IngredientType[]>([])
    const [instructions, setInstructions] = useState<InstructionType[]>([])
    const [fetchRecipeData, setFetchRecipeData] = useState(true);

    const [view, setView] = useState(true)
    const [viewID, setViewID] = useState<Number>(0)

    //re-render page if specific recipe is chosen
    const fetchDataRecipeChild = () => {setFetchRecipeData(!fetchRecipeData)}

    //hide other recipes/recipes table if user is looking for info on one specific recipe
    const hideTable = async (event: React.MouseEvent<HTMLButtonElement>) => {
        setView(false);
        setViewID(+event.currentTarget.id)
        const recipeData = await getRecipeById(+event.currentTarget.id)
        console.log(recipeData)
        //sort instructions in order after being retrieved from database
        let sortedInstructions = recipeData[2].sort((a: InstructionType,b:InstructionType )=>(+a.stepNumber)-(+b.stepNumber))
        //set recipe data into useStates
        setIngredients(recipeData[1])
        setInstructions(sortedInstructions)   
    }

    //show table after user exits view of one recipe
    const showTable = () => {
        setView(true)
        setViewID(0)
        setIngredients([])
        setInstructions([])
    }

    useEffect(() => {
        
        async function fetchData(){
            const response = await getAllRecipes();
                if (response.data){
                console.log(response.data)
                let recipes = response.data;
                //sort recipes that have more saves from other users at the top
                recipes.sort( (a, b) => (a.saves > b.saves) ? -1 : 1 );
                setRecipes(recipes)
                
            }
        }
        fetchData()
    }, [fetchRecipeData])

    

    

    return( 
    <>
        <div style={{display: view ? "": "none"}}>
        <h1 className = "text-center my-4">Featured Recipes</h1>
            <Table>
                {/*tables of recipes that shows names and number of saves from other users*/}
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Recipe Name</th>
                        <th>Saves</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {recipes && Array.isArray(recipes) && currentUser && recipes?.filter(r => r.author.id !==currentUser?.id).map(r => 
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
            {/*view single recipe as chosen by user and display on a card*/}
            {recipes?.filter(r => r.id === viewID).map(r => <RecipeCard key={String(viewID)} recipe = {r} ingredients={ingredients} instructions = {instructions} fetchDataRecipeChild={fetchDataRecipeChild}/>)}
            <Button onClick={showTable}>View Other Recipes</Button>
        </div>
    </>
    )
}
