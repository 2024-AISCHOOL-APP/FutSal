import React, { useContext } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { UserInfo } from '../UserInfo';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const {userId, setUserId, userPw, setUserPw} = useContext(UserInfo)

    const nav = useNavigate(null);

    const sendData = async(e)=>{
        try{
            e.preventDefault();
            const response = await axios.post('/user/handleSignIn',{
                userId : userId,
                userPw : userPw
            })
            // console.log(response);
            response.data.success
            ? nav ('/')
            : nav ('/signin')
        }catch(erorr){
            console.log(erorr);
        }
    }
    return (
    <div>
        <Form onSubmit={sendData}>

            <Form.Group className="mb-3">
                <Form.Label>ID</Form.Label>
                <Form.Control type="text" placeholder="ID" 
                onChange={e=>setUserId(e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" 
                onChange={e=>setUserPw(e.target.value)}/>
            </Form.Group>

            <Button variant="primary" type="submit">
                Sign In
            </Button>

        </Form>
    </div>
  )
}

export default SignIn
