import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { BadRequest, Conflict, Unauthorized } from "./errors";

type AuthContextType = {
    user: any;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

type User = {
    email: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://localhost:8000/api/me", {
            method: "GET",
            credentials: "include",
        })
            .then(res => {
                if (!res.ok) {
                    throw new Unauthorized('Authentication failed');
                }
                return res.json();
            })
            .then(data => {
                setUser({ email: data.email });
            })
            .catch(() => {
                navigate("/login");
            })
            .finally(() => setLoading(false));
    }, []);

    const login = (email: string, password: string): Promise<void> => {
        return fetch("https://localhost:8000/api/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        }).then(res => {
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Unauthorized("Invalid credentials");
                }
                else {
                    throw new Error("Something went wrong");
                }
            }
            return res.json();
        }).then(data => {
            setUser({ email: data.user.email });
        })
            .finally(() => {
                setLoading(false);
            });
    }

    const register = (email: string, password: string): Promise<void> => {
        return fetch("https://localhost:8000/api/register", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        }).then(res => {
            if (!res.ok) {
                if (res.status === 400) {
                    throw new BadRequest();
                }
                if (res.status === 409) {
                    throw new Conflict("Email already in use");
                }
                else {
                    throw new Error("Something went wrong");
                }
            }
            navigate("/login");
        })
            .finally(() => {
                setLoading(false);
            });
    }

    const logout = (): Promise<void> => {
        return fetch("https://localhost:8000/api/logout", {
            method: "POST",
            credentials: "include",
        }).then(res => {
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Unauthorized("You are already logged out");
                }
                throw new Error('Something went wrong')
            }
            else {
                setUser(null);
                navigate("/login");
            }
        });
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be inside AuthProvider");
    return context;
};