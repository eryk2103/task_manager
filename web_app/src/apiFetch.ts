import { Unauthorized } from "./errors";

export default async function apiFetch(url: string, init?: RequestInit): Promise<Response> {

    const requestInit: RequestInit = {
        method: 'get',
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        ...init
    };

    const res = await fetch(import.meta.env.VITE_API_URL + url, requestInit);

    if (res.status !== 401) {
        return res;
    }

    const refreshTokenRes = await fetch(import.meta.env.VITE_API_URL + '/refresh', {
        method: 'get',
        credentials: "include"
    });

    if (!refreshTokenRes.ok) {
        throw new Unauthorized();
    }

    return await fetch(import.meta.env.VITE_API_URL + url, requestInit);
}