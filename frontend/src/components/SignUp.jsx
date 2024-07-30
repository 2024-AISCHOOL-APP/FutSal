import React, { useContext, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
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

    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isIdUnique, setIsIdUnique] = useState(false);
    const [isNicknameUnique, setIsNicknameUnique] = useState(false);
    const [idCheckMessage, setIdCheckMessage] = useState('');
    const [nicknameCheckMessage, setNicknameCheckMessage] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);

    // 모달 관련 상태
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const nav = useNavigate();

    const handleCloseModal = () => setShowModal(false);

    const checkIdUnique = async () => {
        try {
            const response = await axios.post('/user/checkId', { userId });
            const message = response.data.isUnique ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.';
            setIdCheckMessage(message);
            setModalMessage(message);
            setShowModal(true);
            setIsIdUnique(response.data.isUnique);
        } catch (error) {
            console.error('아이디 중복 확인 오류:', error);
        }
    };

    const checkNicknameUnique = async () => {
        try {
            const response = await axios.post('/user/checkNickname', { userNickname });
            const message = response.data.isUnique ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.';
            setNicknameCheckMessage(message);
            setModalMessage(message);
            setShowModal(true);
            setIsNicknameUnique(response.data.isUnique);
        } catch (error) {
            console.error('닉네임 중복 확인 오류:', error);
        }
    };

    const sendData = async (e) => {
        e.preventDefault();
        if (userPw !== passwordConfirm) {
            setPasswordMatch(false);
            setModalMessage('비밀번호가 일치하지 않습니다.');
            setShowModal(true);
            return;
        }
        if (!isIdUnique || !isNicknameUnique) {
            setModalMessage('아이디 또는 닉네임이 중복됩니다.');
            setShowModal(true);
            return;
        }
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
            response.data.success ? nav('/signin') : nav('/signup');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='container'>
            <div className="signup-form-container">
                <header>
                    <h1>회원가입</h1>
                </header>
                <main>
                    <Form onSubmit={sendData}>
                        <div className="formGroup">
                            <Form.Label>아이디</Form.Label>
                            <div className="input-group">
                                <Form.Control type="text" className="loginInput" placeholder="ID" onChange={e => setUserId(e.target.value)} />
                                <Button type="button" className="duplicateCheck" onClick={checkIdUnique}>중복확인</Button>
                            </div>                            
                        </div>
                        <div className="formGroup">
                            <Form.Label>닉네임</Form.Label>
                            <div className="input-group">
                                <Form.Control type="text" className="loginInput" placeholder="Nickname" onChange={e => setUserNickname(e.target.value)} />
                                <Button type="button" className="duplicateCheck" onClick={checkNicknameUnique}>중복확인</Button>
                            </div>                          
                        </div>
                        <div className="formGroup">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control type="password" className="loginInput" placeholder="Password" onChange={e => setUserPw(e.target.value)} />
                        </div>
                        <div className="formGroup">
                            <Form.Label style={{ textAlign: 'center', fontSize: '18px' }}>비밀번호 확인</Form.Label>
                            <Form.Control type="password" className="loginInput" onChange={e => setPasswordConfirm(e.target.value)} />
                            {!passwordMatch && <small style={{ color: 'red' }}></small>}
                        </div>
                        <div className="formGroup">
                            <Form.Label>성별</Form.Label>
                            <div className="gender-group">
                                <Form.Check inline type="radio" id="gender-male" label="남" value="1" checked={userGender === '1'} onChange={e => setUserGender(e.target.value)} />
                                <Form.Check inline type="radio" id="gender-female" label="여" value="0" checked={userGender === '0'} onChange={e => setUserGender(e.target.value)} />
                            </div>
                        </div>
                        <div className="formGroup">
                            <Form.Label>나이</Form.Label>
                            <Form.Control type="number" className="loginInput" placeholder="Age" onChange={e => setUserAge(e.target.value)} />
                        </div>
                        <div className="formGroup">
                            <Form.Label>키</Form.Label>
                            <Form.Control type="number" className="loginInput" placeholder="Height" onChange={e => setUserHeight(e.target.value)} />
                        </div>
                        <div className="formGroup">
                            <Form.Label>몸무게</Form.Label>
                            <Form.Control type="number" className="loginInput" placeholder="Weight" onChange={e => setUserWeight(e.target.value)} />
                        </div>
                        <div className="formGroup">
                            <Form.Label>이메일</Form.Label>
                            <Form.Control type="email" className="loginInput" placeholder="Email" onChange={e => setUserEmail(e.target.value)} />
                        </div>
                        <div className="centered-button">
                            <Button variant="primary" type="submit">가입하기</Button>
                        </div>
                    </Form>
                </main>
            </div>

            {/* 모달 컴포넌트 추가 */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>알림</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SignUp;
