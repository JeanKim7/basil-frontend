import { Link, useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export default function LandingPage () {

    const navigate = useNavigate()

    let redirect= () => {
        navigate('/signup')
    }

    return(
        <>
        <Container >
            <Row className='align-items-center'>
                <Col className='col-6'>
                    <Card className='landing-heading'>
                        <h1> Welcome to Basil</h1>
                        <p>Basil is a recipe-storing and sharing web service. Find and save your favorite recipes, and let others know about them too!</p>
                        <Button id='landing-btn' onClick={redirect}>Sign Up</Button>
                    </Card>
                </Col>
                
            </Row>
            
        </Container>
        </>
    )
}