

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from'react-bootstrap/Card';


export default function LandingPage () {


    

    return(
        

<Container >
<Row className='align-items-center'>
    <Col className='col-6'>
        <Card className='landing-heading ld2'>
            <h3>There's lot of new features coming soon!</h3>
            <p>Basil is still under development and has some kinks to work out! Here are some features we will have in the future:</p>
            <ul>
                <li>Responsive web design</li>
                <li>Importing urls to save recipes</li>
                <li>Comment system</li>
                <li>Post pictures and notes on each attempt at making a recipe</li>
            </ul>
        </Card>
    </Col>
    
</Row>

</Container>
)}