import axios from '../axios';
import React, { useState } from 'react'

export const Test = () => {
    // 7-3 전송 데이터 state 생성 
    const [data, setData] = useState(null);
    
    // 7-1 폼 제출 시 실행함수 
    const sendData = async (e)=> {
        // 7-2. 폼 전송 이벤트 방지 
        e.preventDefault();
        console.log('send data', data);

        // 8-2. axios를 통한 데이터 전송
        try{
            const response = await axios.post('/getData', {data : data})
            console.log(response.data);
        } catch(error){
            console.error(error);
        }
    }
    return (

        <div>
            <form onSubmit={sendData}>
                <h1>Send Data</h1>
                <input type="text" 
                // 7-4 입력값 data에 세팅 
                onChange={e=>setData(e.target.value)}/>
                <input type="submit" />
            </form>
        </div>

    )
}
export default Test
