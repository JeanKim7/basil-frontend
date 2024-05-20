import {Link} from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container';

type NavigationProps ={
    isLoggedIn: boolean,
    logUserOut: () => void,
}

export default function Navigation({isLoggedIn, logUserOut}: NavigationProps) {
  return (
    <Navbar id='navbar' className='white1'>
        <Container fluid>
            <Navbar.Brand as={Link} to = {isLoggedIn ?'/Home': '/'} id = "brand" className='white1'>Basil</Navbar.Brand>
            <Nav>
                {isLoggedIn ? (
                  <>
                  <Nav.Link as={Link} to='/Home' className='white1'>Home</Nav.Link>
                  <Nav.Link as={Link} to = '/myRecipes' className='white1'>My Recipes</Nav.Link>
                  <Nav.Link as= {Link} to ='/search' className='white1'>Search Recipes</Nav.Link>
                  <Nav.Link as = {Link} onClick={()=>logUserOut()} to ='/' className='white1'>Log Out</Nav.Link>
                </>
                ):(
                  <>
                  <Nav.Link as={Link} to='/aboutUs' className='white1'>About Us</Nav.Link>
                  <Nav.Link as={Link} to ='/signup' className='white1'>Sign Up</Nav.Link>
                  <Nav.Link as = {Link} to ='/login' className='white1'>Log In</Nav.Link>
                </>
                )}
            </Nav>
        </Container>
    </Navbar>
  )
}