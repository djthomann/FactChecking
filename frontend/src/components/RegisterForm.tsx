import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Alert, Button, Card, CardBody, Form, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";

const register = async (data: { username: string; password: string }) => {
    await axios.post("/api/auth/register", data);
};

function RegisterForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");

    const mutation = useMutation({
        mutationFn: register,
        onSuccess: () => navigate("/login"),
    });

    const passwordsMatch = password === passwordRepeat;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordsMatch) return;
        mutation.mutate({ username, password });
    };

    const errorMessage =
        axios.isAxiosError(mutation.error) && mutation.error.response?.status === 409
            ? "Username is already taken."
            : "Registration failed.";

    return (
        <Card className="mx-auto mt-5" style={{ maxWidth: 400 }}>
            <CardBody className="p-4">
                <h4 className="mb-4">Register</h4>

                {mutation.isError && <Alert color="danger">{errorMessage}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="username" className="fw-semibold">Username</Label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="password" className="fw-semibold">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            minLength={8}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="passwordRepeat" className="fw-semibold">Repeat password</Label>
                        <Input
                            id="passwordRepeat"
                            type="password"
                            value={passwordRepeat}
                            onChange={(e) => setPasswordRepeat(e.target.value)}
                            autoComplete="new-password"
                            invalid={passwordRepeat !== "" && !passwordsMatch}
                            required
                        />
                        <FormFeedback>Passwords do not match.</FormFeedback>
                    </FormGroup>

                    <Button
                        type="submit"
                        color="primary"
                        className="w-100"
                        disabled={mutation.isPending || !passwordsMatch}
                    >
                        {mutation.isPending ? "Registering…" : "Register"}
                    </Button>
                </Form>
            </CardBody>
        </Card>
    );
}

export default RegisterForm;