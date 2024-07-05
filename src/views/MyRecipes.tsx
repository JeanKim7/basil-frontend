import {useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Accordion from 'react-bootstrap/Accordion';

import { deleteRecipeById } from '../lib/apiWrapper';
import CreateRecipeForm from '../components/CreateRecipeForm';
import EditRecipeForm from '../components/EditRecipeForm';

export default function MyRecipes() {

    const navigate = useNavigate()

    
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
                        <EditRecipeForm/>
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