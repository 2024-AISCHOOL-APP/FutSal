import React from 'react'
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div>
        <p></p>
            <Button variant="dark">
                <Link to='/' style={{ color: 'white', textDecoration: 'none' }}>HOME</Link>
            </Button>
            <Button variant="dark">
                <Link to='/signin' style={{ color: 'white', textDecoration: 'none' }}>SignIn</Link>
            </Button>
            <Button variant="dark">
                <Link to='/signup'style={{ color: 'white', textDecoration: 'none' }}>SignUp</Link>
            </Button>
            <Button variant="dark">
                <Link to='/board' style={{ color: 'white', textDecoration: 'none' }}>Board</Link>
            </Button>
    </div>
  )
}

export default Header