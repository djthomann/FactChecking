import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Alert, Button, Card, CardBody, Form, FormGroup, Input, Label } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";

const login = async (data: { username: string; password: string }) => {
    await axios.get("/api/auth/csrf");
    await axios.post("/api/auth/login", new URLSearchParams(data));
};

function LoginForm() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["me"] });
            navigate("/");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ username, password });
    };

    return (
        <Card className="mx-auto mt-5" style={{ maxWidth: 400 }}>
            <CardBody className="p-4">
                <h4 className="mb-4">Login</h4>

                {mutation.isError && (
                    <Alert color="danger">Invalid username or password.</Alert>
                )}

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
                            autoComplete="current-password"
                            required
                        />
                    </FormGroup>

                    <Button
                        type="submit"
                        color="primary"
                        className="w-100 mb-3"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Logging in…" : "Login"}
                    </Button>

                    <div className="text-center small">
                        No account yet? <Link to="/register">Register</Link>
                    </div>
                </Form>
            </CardBody>
        </Card>
    );
}

export default LoginForm;