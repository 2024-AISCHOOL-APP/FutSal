import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';
import { UserInfo } from '../UserInfo';
import '../css/navbar.css';


const NavMenu = () => {
  const { isLoggedIn } = useContext(UserInfo);

  let nav = useNavigate();

  return (
    <Navbar expand="lg" style={{ backgroundColor: '#80E5A8' }}>
      <Container fluid>
        <Navbar.Brand href="/" className="Navbar-brand">
          <img src={process.env.PUBLIC_URL + '/Logo/Navbar-Logo.jpeg'} width="100px" alt="Navbar Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="flex-grow-1">
          <Nav
            className="justify-content-end flex-grow-1 pe-3"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Link to="/board" className="nav-link">게시판</Link>
            <NavDropdown title="팀" id="navbarScrollingDropdown">
              <NavDropdown.Item onClick={()=>nav('/team')}>마이 팀</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={()=>nav('/teamlist')}>
                팀 찾기
              </NavDropdown.Item>
              <NavDropdown.Item onClick={()=>nav('/createteam')}>
                팀 생성
              </NavDropdown.Item>
            </NavDropdown>
            {isLoggedIn ? (
              <Link to="/signin" className="nav-link">로그인</Link>
            ) : (
              <Link to="/mypage" className="nav-link">마이페이지</Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavMenu;
