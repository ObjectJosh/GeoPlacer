import React, { useContext, useState } from 'react'

const UserContext = React.createContext()

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ id, children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [displayChat, setDisplayChat] = useState(false);


    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, displayChat, setDisplayChat }}>
            {children}
        </UserContext.Provider>
    )
}