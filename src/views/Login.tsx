import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button'

import { login } from '../lib/apiWrapper';
import { UserFormDataType } from '../types'

type LoginProps = {
    logUserIn: () => void
}

export default function Login ({logUserIn}: LoginProps) {
    const navigate =useNavigate()   
    
    const [seePassword, setSeePassword] = useState(false)
    const [userFormData, setUserFormData] = useState<Partial<UserFormDataType>>(
        {
            username: '',
            password: '',
        }
    )

    //useState for user input when entering login credentials
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserFormData({...userFormData, [e.target.name]: e.target.value})
    }

    const handleFormSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        console.log('Logging in...')

        //send username and password to backend to verify user exists
        const response = await login(userFormData.username!, userFormData.password!)
        if (response.error){
            console.log(response.error)
        } else {
            //recieve token to time how long user will be logged in for
            const token = response.data!.token;
            const tokenExp = response.data!.tokenExpiration;
            console.log(response.data)
            localStorage.setItem('token', token);
            localStorage.setItem('tokenExp', tokenExp);
            logUserIn();
            console.log("You have successfully logged in");
            navigate('/Home')
        }
    }

    

    return (
        <>
        <Card className = "start-form login">
        <h1 className='text-center'>Login</h1>
        <Card.Body>
            <Form onSubmit={handleFormSubmit}>
                <Form.Label htmlFor="username">Username</Form.Label>
                <Form.Control id='username' name= 'username' placeholder='Enter username' value = {userFormData.username} onChange = {handleInputChange}/>

                <Form.Label htmlFor="password">Password</Form.Label>
                    
                    <InputGroup>
                        <Form.Control id='password' name= 'password' placeholder='Enter password' type={!seePassword? 'password': 'text'} value = {userFormData.password} onChange = {handleInputChange}/>
                        {/*allow password to be shown or hidden*/}
                        <InputGroup.Text onClick = {() => setSeePassword(!seePassword)}>{seePassword?"Hide" :"Show"}</InputGroup.Text>
                    </InputGroup>
                
                <Button type ="submit" variant='success'>Log In</Button>
                </Form>
        </Card.Body>
        </Card>

        </>
  )
}