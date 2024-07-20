import React from 'react'
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div>
        <h1>React.js-Express.js</h1>
            <Button variant="dark">
                <Link to='/'>HOME</Link>
            </Button>
            <Button variant="warning">
                <Link to='/signin'>SignIn</Link>
            </Button>
            <Button variant="success">
                <Link to='/signup'>SignUp</Link>
            </Button>
    </div>
  )
}

export default Header