import React, { useContext } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { UserInfo } from '../UserInfo';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import '../css/signup.css';

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

    const nav = useNavigate();

    const sendData = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/user/handleSignUp', {
                userId: userId,
                userPw: userPw,
                userNickname: userNickname,
                userGender: userGender,
                userAge: userAge,
                userHeight: userHeight,
                userWeight: userWeight,
                userEmail: userEmail
            });
            console.log(response);
            response.data.success ? nav('/signin') : nav('/signup');
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="container">
            <header>
                <h1>회원가입</h1>
            </header>
            <main>
                <Form onSubmit={sendData}>
                    <div className="form-group">
                        <Form.Label>아이디</Form.Label>
                        <div className="input-group">
                            <Form.Control type="text" className="loginInput" placeholder="ID" onChange={e => setUserId(e.target.value)} />
                            <Button type="button" className="duplicateCheck">중복확인</Button>
                        </div>
                    </div>
                    <div className="form-group">
                        <Form.Label>닉네임</Form.Label>
                        <div className="input-group">
                            <Form.Control type="text" className="loginInput" placeholder="Nickname" onChange={e => setUserNickname(e.target.value)} />
                            <Button type="button" className="duplicateCheck">중복확인</Button>
                        </div>
                    </div>
                    <div className="form-group">
                        <Form.Label>비밀번호</Form.Label>
                        <Form.Control type="password" className="loginInput" placeholder="Password" onChange={e => setUserPw(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <Form.Label>비밀번호 확인</Form.Label>
                        <Form.Control type="password" className="loginInput" />
                    </div>
                    <div className="form-group">
                        <Form.Label>성별</Form.Label>
                        <div className="gender-group">
                            <Form.Check inline type="radio" id="gender-male" label="Male" value="1" checked={userGender === '1'} onChange={e => setUserGender(e.target.value)} />
                            <Form.Check inline type="radio" id="gender-female" label="Female" value="0" checked={userGender === '0'} onChange={e => setUserGender(e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <Form.Label>나이</Form.Label>
                        <Form.Control type="number" className="loginInput" placeholder="Age" onChange={e => setUserAge(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <Form.Label>키</Form.Label>
                        <Form.Control type="number" className="loginInput" placeholder="Height" onChange={e => setUserHeight(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <Form.Label>몸무게</Form.Label>
                        <Form.Control type="number" className="loginInput" placeholder="Weight" onChange={e => setUserWeight(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <Form.Label>이메일</Form.Label>
                        <Form.Control type="email" className="loginInput" placeholder="Email" onChange={e => setUserEmail(e.target.value)} />
                    </div>
                    <div className="centered-button">
                        <Button variant="primary" type="submit">가입하기</Button>
                    </div>
                </Form>
            </main>
        </div>
    );
};

export default SignUp;