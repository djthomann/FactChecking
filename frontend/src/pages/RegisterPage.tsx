import axios from "axios";
import { useState } from "react";
import RegisterForm from "../components/RegisterForm";


export const login = async (username: string, password: string) => {
    await axios.post(
        "/api/auth/login",
        new URLSearchParams({ username, password })
    );
};

export const logout = () => axios.post("/api/auth/logout");

export const fetchMe = async () => {
    const res = await axios.get<{ username: string }>("/api/auth/me");
    return res.data;
};

function RegisterPage() {

    return (
        <RegisterForm></RegisterForm>
    )

}

export default RegisterPage