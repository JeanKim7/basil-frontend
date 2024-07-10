import { useState } from "react"

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

import SearchRecipeCard from "../components/SearchRecipeCard"
import { apiSearch } from "../lib/apiWrapper";
import { RecipeFormDataType, IngredientFormType, InstructionFormType, apiRecipeType } from "../types";

export default function SearchRecipe (){

    const [searchTerm, setSearchTerm] = useState('')

    const [searchRecipes, setSearchRecipes] = useState<RecipeFormDataType[]>()
    const [ingredients, setIngredients] = useState<IngredientFormType[][]>([])
    const [instructions, setInstructions] = useState<InstructionFormType[][]>([])

    const [viewAllRecipes, setViewAllRecipes] = useState(false)

    const [viewOneRecipe, setViewOneRecipe] = useState(false)
    const [viewIndex, setViewIndex] = useState<number>(0)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }

    const convertApiRecipes = (recipes: apiRecipeType[]) => {
        
        let convertedRecipes: RecipeFormDataType[] = [] 

        for (let recipe of recipes) {
            let convertedRecipe: RecipeFormDataType = {
                name: recipe.strMeal || '',
                description: 'Not available',
                cuisine: recipe.strArea || '',
                cookTime: "0",
                servings: 'Not available'
            }

            convertedRecipes.push(convertedRecipe)
        }
        return convertedRecipes
    }

    const convertIngredients = (recipes: apiRecipeType[]) => {
        let masterIngredientsList: IngredientFormType[][] = []

        for (let recipe of recipes) {
            let convertedIngredients: IngredientFormType[] = []
            //Make recipe object be indexable by strings to loop through ingredients and add them to the card
            interface IDictionary { [index:string]: string | null}
            let params = {} as IDictionary
            params = recipe

            for (let i=1; i<21; i++){
                if (params[`strIngredient${i}`] === ''){
                    break
                } else {
                    let iName: string = params[`strIngredient${i}`] as string;
                    let iQuantity; 
                    let iUnit;

                    let quantityStr = params[`strMeasure${i}`]
                    let quantityStrList;
                    if (quantityStr?.includes(" ")){
                        quantityStrList = quantityStr!.split(` `)

                    if (isNaN(+quantityStrList[0])){
                        iQuantity = "0"
                        iUnit = quantityStrList.join(" ")
                    }   else {
                        iQuantity= quantityStrList[0]
                        quantityStrList.splice(0, 1)
                        iUnit = quantityStrList.join(" ")
                    }} else {
                        iQuantity = "0";
                        iUnit = quantityStr!
                    }

                    convertedIngredients.push({
                        name: iName,
                        quantity: iQuantity,
                        unit: iUnit
                    })
                }
            }
            masterIngredientsList.push(convertedIngredients)    
        }

        return masterIngredientsList
    }

    const convertInstructions = (recipes: apiRecipeType[]) => {

        let masterInstructionsList: InstructionFormType[][] = []

        for (let recipe of recipes) {
            let convertedInstructions: InstructionFormType[] = []

            interface IDictionary { [index:string]: string | null}
            let params = {} as IDictionary
            params = recipe

            let steps  = params[`strInstructions`] as string

            let stepList = steps.split("\r\n")
            let count = 0
            for (let s of stepList){
                count+=1
                convertedInstructions.push({
                    body: s, 
                    stepNumber: `${count}`
                })
            }

            masterInstructionsList.push(convertedInstructions)
        }

        return masterInstructionsList
    }


    const handleFormSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        console.log(searchTerm)

        const response = await apiSearch(searchTerm)
        if (response.error) {
            console.log(response.error)
        } else {
            console.log('success')
            let data = response.data!.meals
            if (data === null) {
                console.log('No matching searches found')
            } else {
            setSearchRecipes(convertApiRecipes(data))
            setIngredients(convertIngredients(data)!)
            setInstructions(convertInstructions(data)!)
            setViewAllRecipes(true)
            }
        }
    }

    const hideTable = (event: React.MouseEvent<HTMLButtonElement>) => {
        setViewAllRecipes(false);
        setViewOneRecipe(true);
        setViewIndex(+event.currentTarget.value);  
    }

    const showTable = () => {
        setViewAllRecipes(true);
        setViewOneRecipe(false);
        setViewIndex(0)
    }

    return(
    <>
        <div style={{display: viewOneRecipe ? "none": ""}}>
        <Container className ="d-flex justify-content-center">
            <Form onSubmit = {handleFormSubmit}>
            
                <Form.Control className="searchbar" value={searchTerm} placeholder='Search Recipes' onChange={handleInputChange} />
                <Container className ="d-flex justify-content-center">
                        <Button className="button-size" type='submit'>Search Recipe</Button>
                </Container>

            </Form>
        </Container>
        </div>

        <div style={{display: viewAllRecipes ? "": "none"}}>
            <h1 className = "text-center mb-4">Results</h1>
            <Table>
                <thead>
                    <tr>
                        <th>Recipe Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {searchRecipes && Array.isArray(searchRecipes) && searchRecipes.map((r, index) => 
                    <tr>
                        <td>{r.name}</td>
                        <td>{r.description}</td>
                        <td></td>
                        <td><Button onClick={hideTable} key={index} value={index}>View Recipe</Button></td>
                    </tr>)}
                </tbody>
            </Table>
        </div>

        <div style={{display: viewOneRecipe ? "": "none"}}>
                {searchRecipes ? <SearchRecipeCard recipe = {searchRecipes[viewIndex]} ingredients={ingredients[viewIndex]} instructions = {instructions[viewIndex]}/>: <></>}
                <Button onClick={showTable}>View Other Recipes</Button>
        </div>
    </>
    )
}