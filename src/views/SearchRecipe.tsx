import { useState } from "react"

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

import SearchRecipeCard from "../components/SearchRecipeCard"
import { apiSearch } from "../lib/apiWrapper";
import { RecipeFormDataType, IngredientFormType, InstructionFormType, apiRecipeType } from "../types";

//search www.themealdb.com API for recipes, render as cards with information
export default function SearchRecipe (){

    //set useState for sesarch terms, information in recipes
    const [searchTerm, setSearchTerm] = useState('')

    const [searchRecipes, setSearchRecipes] = useState<RecipeFormDataType[]>()
    const [ingredients, setIngredients] = useState<IngredientFormType[][]>([])
    const [instructions, setInstructions] = useState<InstructionFormType[][]>([])

    //set useState for if user wants to see list of all recipes in shorter form
    const [viewAllRecipes, setViewAllRecipes] = useState(false)

    //set useState for if user wants to see more info about one recipe, record index of recipe in overall list
    const [viewOneRecipe, setViewOneRecipe] = useState(false)
    const [viewIndex, setViewIndex] = useState<number>(0)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }

    //convert json response from themealdb API to recipe data type, easier to display and later save if needed
    const convertApiRecipes = (recipes: apiRecipeType[]) => {
        
        let convertedRecipes: RecipeFormDataType[] = [] 

        //leave description and servings not available as they are not in the database
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

    //convert each ingredient from API response into their own useState to be displayed and later saved
    const convertIngredients = (recipes: apiRecipeType[]) => {
        //masterIngredientsList is a list of all the recipes, each recipe will be a list of ingredients
        let masterIngredientsList: IngredientFormType[][] = []

        for (let recipe of recipes) {
            let convertedIngredients: IngredientFormType[] = []
            //set interface to access API recipe object keys(give them a general type of string so different keys can be accessed)
            interface IDictionary { [index:string]: string | null}
            let params = {} as IDictionary
            //set recipe to this interface to define type and access keys
            params = recipe

            //only 20 ingredients at most in each recipe, loop through 20 times max
            for (let i=1; i<21; i++){
                //break if ingredient is empty, indicates no more ingredients
                if (params[`strIngredient${i}`] === ''){
                    break
                } else {
                    let iName: string = params[`strIngredient${i}`] as string;
                    let iQuantity; 
                    let iUnit;

                    //store ingredient measurement (value from API object) as a string in this variable, index of ingredient and its measurement in the API object should be the same
                    let quantityStr = params[`strMeasure${i}`]
                    let quantityStrList;

                    //break up string by spaces into a list
                    if (quantityStr?.includes(" ")){
                        quantityStrList = quantityStr!.split(` `)

                    //some ingredients do not have numbers (i.e. "a sprinkle"), set quantity of ingredients with this measurement to zero, will have to change later
                    if (isNaN(+quantityStrList[0])){
                        iQuantity = "0"
                        iUnit = quantityStrList.join(" ")
                    }   else {
                        //if ingredient does have number for quantity, set quantity to that value
                        iQuantity= quantityStrList[0]
                        //remove number from ingredient string list
                        quantityStrList.splice(0, 1)
                        //combine remaining strings to be the unit, store in variable
                        iUnit = quantityStrList.join(" ")
                    }} else {
                        //if ingredient has no spaces, set quantity to zero and unit to the string
                        iQuantity = "0";
                        iUnit = quantityStr!
                    }

                    //add ingredient to a list, this list will represent one recipe
                    convertedIngredients.push({
                        name: iName,
                        quantity: iQuantity,
                        unit: iUnit
                    })
                }
            }

            //add this list to a master list, each list will be a recipe, master list will be all the recipes
            masterIngredientsList.push(convertedIngredients)    
        }

        return masterIngredientsList
    }

    const convertInstructions = (recipes: apiRecipeType[]) => {

        //same as ingredients, master list will have each recipe be a list as an item
        let masterInstructionsList: InstructionFormType[][] = []

        for (let recipe of recipes) {
            let convertedInstructions: InstructionFormType[] = []

            //give shape to API response object and allow differnt keys to be accessed
            interface IDictionary { [index:string]: string | null}
            let params = {} as IDictionary
            //set API response object to this interface
            params = recipe

            //instructions are just one string in API response object, store in this variable
            let steps  = params[`strInstructions`] as string

            //split instruction string by newlines or carriage returns 
            let stepList = steps.split("\r\n")
            let count = 0
            //give each step a number
            for (let s of stepList){
                count+=1
                //create an object for each step of instruction using broken up string and step number
                convertedInstructions.push({
                    body: s, 
                    stepNumber: `${count}`
                })
            }

            masterInstructionsList.push(convertedInstructions)
        }

        return masterInstructionsList
    }

    //retrieve recipes that match search term
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
            //store each list of converted recipes, ingredients and instructions in useState variables
            setSearchRecipes(convertApiRecipes(data))
            setIngredients(convertIngredients(data)!)
            setInstructions(convertInstructions(data)!)
            setViewAllRecipes(true)
            }
        }
    }

    //hide all recipes while showing one recipe
    const hideTable = (event: React.MouseEvent<HTMLButtonElement>) => {
        setViewAllRecipes(false);
        setViewOneRecipe(true);
        setViewIndex(+event.currentTarget.value);  
    }

    //show all recipes after looking at detail information about one recipe and leaving that one recipe
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
                {/*sesarch bar html element*/}
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
                    {/*map each recipe as one row on a table*/}
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
        
        {/*display one recipe on a card if user wants to see that recipe specifically */}
        <div style={{display: viewOneRecipe ? "": "none"}}>
                {searchRecipes ? <SearchRecipeCard recipe = {searchRecipes[viewIndex]} ingredients={ingredients[viewIndex]} instructions = {instructions[viewIndex]}/>: <></>}
                <Button onClick={showTable}>View Other Recipes</Button>
        </div>
    </>
    )
}