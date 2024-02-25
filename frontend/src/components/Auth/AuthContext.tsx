import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    setToken: () => {},
    loading: true,
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        setLoading(false);
    }, []);

    const authContextValue: AuthContextType = {
        token,
        setToken,
        loading,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
