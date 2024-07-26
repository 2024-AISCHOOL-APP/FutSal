import { createContext, useState } from "react";


export const UserInfo = createContext(null);

export const UserInfoProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [userPw, setUserPw] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <UserInfo.Provider
            value={{
                userId,
                setUserId,
                userPw,
                setUserPw,
                isLoggedIn,
                setIsLoggedIn,
            }}
        >
            {children}
        </UserInfo.Provider>
    );
};
