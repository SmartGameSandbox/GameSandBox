import { createContext } from 'react';

const UserContext = createContext(localStorage.getItem('username'));

export default UserContext;
