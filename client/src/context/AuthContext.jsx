import {createContext , useContext , useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }){
    const [ user , setUser ] = useState(()=>{
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const name = localStorage.getItem('name');
        const id = localStorage.getItem('id')
        return token ? { token, role, name, id } : null;
    });
    const login = (data) =>{
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('name', data.name);
        localStorage.setItem('id', data.id);
        setUser(data);
    }
    const logout = () =>{
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('id'); 
        setUser(null);
    }
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
export function useAuth(){
    return useContext(AuthContext);
}