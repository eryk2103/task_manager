import { useAuth } from "./auth/authContext";
import { Unauthorized } from "./errors";

export default function useApiFetch() {
    const { user, setUser } = useAuth();

    const apiFetch = async (url: string, init?: RequestInit): Promise<Response> => {

        const requestInit: RequestInit = {
            method: 'get',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user?.accessToken}`
            },
            ...init
        };

        const res = await fetch(import.meta.env.VITE_API_URL + url, requestInit);

        if (res.status !== 401) {
            return res;
        }


        const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrf_token='))?.split('=')[1] || '';

        const refreshTokenRes = await fetch(import.meta.env.VITE_API_URL + '/auth/refresh', {
            method: 'post',
            credentials: "include",
            headers: {
                'X-CSRF-TOKEN': csrfToken
            }
        });

        if (!refreshTokenRes.ok) {
            throw new Unauthorized();
        }

        const data = await refreshTokenRes.json();

        setUser({ email: user?.email || '', accessToken: data.token })

        const requestInitRetry: RequestInit = {
            method: 'get',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${data.token}`
            },
            ...init
        };


        return await fetch(import.meta.env.VITE_API_URL + url, requestInitRetry);
    }

    return { apiFetch };
}