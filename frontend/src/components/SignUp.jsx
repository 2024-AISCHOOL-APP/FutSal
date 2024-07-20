import React, { useContext } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { UserInfo } from '../UserInfo';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const { userId, setUserId,
          userPw, setUserPw,
          userNickname, setUserNickname,
          userGender, setUserGender,
          userAge, setUserAge,
          userHeight, setUserHeight,
          userWeight, setUserWeight,
          userEmail, setUserEmail
        } = useContext(UserInfo);

  const nav = useNavigate(null);

  const sendData = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('/user/handleSignUp', {
          userId : userId,
          userPw : userPw,
          userNickname : userNickname,
          userGender : userGender,
          userAge : userAge,
          userHeight : userHeight,
          userWeight : userWeight,
          userEmail : userEmail
      })
      console.log(response);
      response.data.success
      ? nav('/')
      : nav('/signup')
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <Form onSubmit={sendData}>
        <Form.Group className="mb-3">
          <Form.Label>ID</Form.Label>
          <Form.Control type="text" placeholder="ID"
            onChange={e => setUserId(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password"
            onChange={e => setUserPw(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nickname</Form.Label>
          <Form.Control type="text" placeholder="Nickname"
            onChange={e => setUserNickname(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Gender</Form.Label>
          <Form.Control type="text" placeholder="Gender"
            onChange={e => setUserGender(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Age</Form.Label>
          <Form.Control type="number" placeholder="Age"
            onChange={e => setUserAge(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Height</Form.Label>
          <Form.Control type="number" placeholder="Height"
            onChange={e => setUserHeight(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Weight</Form.Label>
          <Form.Control type="number" placeholder="Weight"
            onChange={e => setUserWeight(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Email"
            onChange={e => setUserEmail(e.target.value)} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Sign Up
        </Button>

      </Form>
    </div>
  )
}

export default SignUp
