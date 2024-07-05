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

    
    
    const [recipes, setRecipes] = useState<RecipeType[]>([])
    const [ingredients, setIngredients] = useState<IngredientType[]>([])
    const [instructions, setInstructions] = useState<InstructionType[]>([])
    const [fetchRecipeData, setFetchRecipeData] = useState(true);

    const [view, setView] = useState(true)
    const [viewID, setViewID] = useState<Number>(0)

    const fetchDataRecipeChild = () => {setFetchRecipeData(!fetchRecipeData)}

    const hideTable = async (event: React.MouseEvent<HTMLButtonElement>) => {
        setView(false);
        setViewID(+event.currentTarget.id)
        const recipeData = await getRecipeById(+event.currentTarget.id)
        console.log(recipeData)
        let sortedInstructions = recipeData[2].sort((a: InstructionType,b:InstructionType )=>(+a.stepNumber)-(+b.stepNumber))
        setIngredients(recipeData[1])
        setInstructions(sortedInstructions)   
    }

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
                recipes.sort( (a, b) => (new Date(a.dateCreated) > new Date(b.dateCreated) ? -1 : 1) );
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
                        <td></td>
                        <td><Button onClick={hideTable} id={`${r.id}`}>View Recipe</Button></td>
                    </tr>)}
                </tbody>
            </Table>

        {/* {recipes && Array.isArray(recipes) && currentUser && recipes?.filter(r => r.author.id !==currentUser?.id).map(r => <RecipeCard key = {r.id} recipe={r} fetchDataRecipeChild={fetchRecipeDataChild} />)} */}

        {/* <h1 className = "text-center mb-4"> My Recipes</h1>
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
            </Table> */}
        {/* {recipes && Array.isArray(recipes) && currentUser && recipes?.filter(r => r.author.id ===currentUser?.id).map(r => <RecipeCard key = {r.id} recipe={r} fetchDataRecipeChild={fetchRecipeDataChild}/>)}
        {recipes?.filter(r => r.author.id ===currentUser?.id ).length === 0 ? <h3>None to display</h3>: <></>} */}
        </div>
        <div style={{display: view ? "none": ""}}>
            {recipes?.filter(r => r.id === viewID).map(r => <RecipeCard key={String(viewID)} recipe = {r} ingredients={ingredients} instructions = {instructions} fetchDataRecipeChild={fetchDataRecipeChild}/>)}
            <Button onClick={showTable}>View Other Recipes</Button>
        </div>
    </>
    )
}
