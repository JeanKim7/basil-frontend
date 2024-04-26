import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import  RecipeCard  from '../components/RecipeCard'
import { UserType, RecipeType } from '../types';
import { getAllRecipes } from '../lib/apiWrapper';

type HomeProps = {
    currentUser: UserType | null,


}

export default function Home ({currentUser}:HomeProps){

    let body: HTMLElement= document.body

    body.setAttribute("style", "backgroundImage: '/floor-1256804_1280.png")
    
    const [recipes, setRecipes] = useState<RecipeType[]>([])
    const [fetchRecipeData, setFetchRecipeData] = useState(true);

    const fetchRecipeDataChild = () => setFetchRecipeData(!fetchRecipeData) 


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
        <h1 className = "text-center my-4">Featured Recipes</h1>
        {recipes.length !== 0 ? recipes.filter(r => r.author.id !==currentUser!.id).map(r => <RecipeCard key = {r.id} recipe={r} fetchDataRecipeChild={fetchRecipeDataChild} />) : <></>}
        <h1 className = "text-center mb-4"> My Recipes</h1>
        {recipes.length !== 0 ? recipes.filter(r => r.author.id ===currentUser!.id).map(r => <RecipeCard key = {r.id} recipe={r} fetchDataRecipeChild={fetchRecipeDataChild}/>): <></>}
        {recipes.filter(r => r.author.id ===currentUser!.id ).length === 0 ? <h3>None to display</h3>: <></>}


    </>
    )
}
