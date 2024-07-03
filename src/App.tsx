import { useState, useEffect } from 'react';
import {Routes, Route} from 'react-router-dom';


import Container from 'react-bootstrap/Container';

import Navigation from './components/Navigation';
import LandingPage from './views/LandingPage';
import AboutUs from './views/AboutUs';
import SignUp from './views/SignUp';
import Login from './views/Login';
import Home from './views/Home'
import MyRecipes from './views/MyRecipes';
import CreateRecipe from './components/CreateRecipeForm';
import SearchRecipe from './views/SearchRecipe';

import { getMe } from './lib/apiWrapper'
import { CategoryType, UserType } from './types';

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') && new Date(localStorage.getItem('tokenExp')||0) > new Date() ? true : false);
  const [loggedInUser, setLoggedInUser] = useState<UserType|null>(null)

  const [message, setMessage] = useState<string | undefined>(undefined)
  const [category, setCategory] = useState<CategoryType|undefined>(undefined)


  useEffect(() => {
    console.log('This is running')
    async function getLoggedInUser(){
        if (isLoggedIn){
            const token = localStorage.getItem('token') || ''
            const response = await getMe(token);
            if (response.data){
                setLoggedInUser(response.data);
                localStorage.setItem('currentUser', JSON.stringify(response.data));
            } else {
                setIsLoggedIn(false);
                console.error(response.data);
            }
        }
    }

    getLoggedInUser()
  }, [isLoggedIn])
  

  const logUserIn = () => {
  setIsLoggedIn(true)
  }

  const logUserOut = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    localStorage.removeItem('token')
    localStorage.removeItem('tokenExp')
    localStorage.removeItem('currentUserId');
    console.log('You have been logged out')
  }

  const flashMessage = (newMessage:string | undefined, newCategory: CategoryType | undefined) => {
    setMessage(newMessage);
    setCategory(newCategory);
  }
  

  return (
    <>
    <Navigation isLoggedIn={isLoggedIn} logUserOut={logUserOut}/>
      <Container>
        <Routes>
          <Route path='/' element={<LandingPage/> } />
          <Route path='/Home' element = {<Home currentUser={loggedInUser}/>} />
          <Route path='/aboutUs' element={<AboutUs />} />
          <Route path ='/signup' element={<SignUp />} />
          <Route path = 'login' element = {<Login logUserIn = {logUserIn}/>} />
          <Route path = '/myRecipes' element = {<MyRecipes />} />
          <Route path = '/createRecipe' element = {<CreateRecipe/>} />
          <Route path='/search' element= {<SearchRecipe/>} />
        </Routes>
      </Container>
   </>)
}