import { createContext, useContext, useState, type ReactNode, useEffect, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router";
import { BadRequest, Conflict, Unauthorized } from "../errors";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: Dispatch<SetStateAction<User | null>>;
};

type User = {
    email: string;
    accessToken: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrf_token='))?.split('=')[1] || '';

        const refresh = async () => {
            try {
                const res = await fetch(import.meta.env.VITE_API_URL + '/auth/refresh', {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        'X-CSRF-TOKEN': csrfToken
                    }
                })

                if (!res.ok) {
                    throw new Unauthorized();
                }

                const data = await res.json();

                const res2 = await fetch(import.meta.env.VITE_API_URL + '/auth/me', {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        'Authorization': `Bearer ${data.token}`
                    }
                })

                if (!res2.ok) {
                    throw new Unauthorized();
                }

                const data2 = await res2.json();

                setUser({ email: data2.email, accessToken: data.token })
            }
            catch {
                navigate('/login');
            }
            finally {
                setLoading(false);
            }
        }
        refresh();
    }, []);

    const login = (email: string, password: string): Promise<void> => {
        return fetch(import.meta.env.VITE_API_URL + '/auth/login', {
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
            const accessToken = data.token;
            fetch(import.meta.env.VITE_API_URL + '/auth/me', {
                method: "GET",
                credentials: "include",
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(res => {
                    if (!res.ok) {
                        navigate('/login');
                    }
                    return res.json();
                })
                .then(data => {
                    setUser({ email: data.email, accessToken: accessToken })
                })
        })
            .finally(() => {
                setLoading(false);
            });
    }

    const register = (email: string, password: string): Promise<void> => {
        return fetch(import.meta.env.VITE_API_URL + '/auth/register', {
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
        return fetch(import.meta.env.VITE_API_URL + '/auth/logout', {
            method: "POST",
            credentials: "include",
            headers: {
                'Authorization': `Bearer ${user?.accessToken}`
            }
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
        <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be inside AuthProvider");
    return context;
};