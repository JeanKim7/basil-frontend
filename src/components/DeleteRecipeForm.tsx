import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import {deleteRecipeById} from '../lib/apiWrapper';

type DeleteRecipeFormProps = {
    recipeId: number
}

export default function DeleteRecipeForm({recipeId}:DeleteRecipeFormProps){

    const navigate = useNavigate()

    const deleteRecipe = async () => {
        const token = localStorage.getItem('token') || ''
        const response = await deleteRecipeById(token, recipeId)
        if (response.error){
            console.log(response.error)
        } else if (response.data){
            console.log(response.data)
            navigate('/Home')
        }
    }

    return (
        <Card className ='my-1 p-3 recipe-input'>
            <Button onClick={deleteRecipe}>Delete Recipe</Button>
        </Card>
    )
}