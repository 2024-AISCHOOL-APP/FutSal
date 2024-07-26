import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../css/navbar.css'
import { Link } from 'react-router-dom';

const navbarUnLog = () => {
  return (
    <Navbar expand="lg" style={{backgroundColor:'#80E5A8'}}>
      <Container fluid>
        <Navbar.Brand href="/" className='Navbar-brand'><img src={process.env.PUBLIC_URL + '/Logo/Navbar-Logo.jpeg'} width='100px' /></Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className='flex-grow-1'>
          <Nav
            className="justify-content-end flex-grow-1 pe-3"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Link to="/board" className="nav-link">게시판</Link>
            <Link to="#action2" className="nav-link">랭킹</Link>
            <Link to="/team" className="nav-link">팀</Link>
            <Link to="/signin" className="nav-link">로그인</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default navbarUnLog