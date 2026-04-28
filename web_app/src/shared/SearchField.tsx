import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
    loading: boolean;
    onChange: (str: string) => void;
}

export default function SearchField({ ...props }: Props) {
    const [search, setSearch] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            props.onChange(search);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search])

    return (
        <TextField id="search" label="Search" variant="outlined" disabled={props.loading} onChange={(e) => setSearch(e.target.value)} />
    );
}