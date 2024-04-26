import { useState } from "react";
import { useNavigate } from 'react-router-dom'

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import  InputGroup from "react-bootstrap/InputGroup";
import Button  from "react-bootstrap/Button";

import { register } from "../lib/apiWrapper";
import { UserFormDataType } from '../types'



export default function SignUp() {

    const navigate=useNavigate()

    const [seePassword, setSeePassword] = useState(false)
    const [userFormData, setUserFormData] = useState<UserFormDataType>(
        {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserFormData({...userFormData, [e.target.name]: e.target.value})
    }

    const handleFormSubmit = async (e:React.FormEvent) => {
        e.preventDefault();

        console.log(userFormData);

        let response = await register(userFormData)
        if (response.error){
            console.log(response.error);
        }else{
            let newUser=response.data!
            console.log(`Congrats ${newUser.firstName} ${newUser.lastName} has been created with the username ${newUser.username}`, 'success')
            navigate('/')
        }
    }

    const disableSubmit = userFormData.password.length < 5 || userFormData.password !== userFormData.confirmPassword

    return (
        <>
        <Card className = "start-form">
        <h1 className="text-center">Register Here</h1>
            <Card.Body>
                <Form onSubmit={handleFormSubmit}>
                    <Form.Label htmlFor="firstName">First Name</Form.Label>
                    <Form.Control id='firstName' name= 'firstName' placeholder='Enter first name' value = {userFormData.firstName} onChange = {handleInputChange}/>

                    <Form.Label htmlFor="lastName">Last Name</Form.Label>
                    <Form.Control id='lastName' name= 'lastName' placeholder='Enter last name' value = {userFormData.lastName} onChange = {handleInputChange}/>

                    <Form.Label htmlFor="email">Email</Form.Label>
                    <Form.Control id='email' name= 'email' placeholder='Enter email' value = {userFormData.email} onChange = {handleInputChange}/>

                    <Form.Label htmlFor="username">Username</Form.Label>
                    <Form.Control id='username' name= 'username' placeholder='Enter username' value = {userFormData.username} onChange = {handleInputChange}/>

                    <Form.Label htmlFor="password">Password</Form.Label>
                    <InputGroup>
                        <Form.Control id='password' name= 'password' placeholder='Enter password' type={!seePassword? 'password': 'text'} value = {userFormData.password} onChange = {handleInputChange}/>
                        <InputGroup.Text onClick = {() => setSeePassword(!seePassword)}>{seePassword?"Hide" :"Show"}</InputGroup.Text>
                    </InputGroup>
                    
                    <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
                    <InputGroup>
                        <Form.Control id='confirmPassword' name= 'confirmPassword' placeholder='Confirm pasword' type={!seePassword? 'password': 'text'} value = {userFormData.confirmPassword} onChange = {handleInputChange}/>
                        <InputGroup.Text onClick = {() => setSeePassword(!seePassword)}>{seePassword?"Hide" :"Show"}</InputGroup.Text>
                    </InputGroup>
                    <Button id = 'sign-up-btn' type ="submit" variant='success' disabled={disableSubmit}>Sign Up</Button>
                </Form>
            </Card.Body>
        </Card>
        </>
    
    )
}