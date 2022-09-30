import React, { useRef, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    Container,
    Form,
    FormControl,
    FormGroup,
    FormLabel,
    Spinner,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { loginActions } from '../store/login-slice';
import { RootState } from '../store/index';
import classes from './login.module.css';
import { Navigate, useNavigate } from 'react-router-dom';

const Login = () => {
    const isLoggedIn = useSelector((state: RootState) => state.login.logged);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, message: '' });
    const [showConfirmAlert, setConfirmAlert] = useState(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    const sendLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsError({ status: false, message: '' });
        setIsLoading(true);
        let dataFetched;
        let result;
        try {
            dataFetched = await fetch(
                import.meta.env.VITE_BACKEND_URL + '/auth/verify',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        username: usernameRef.current!.value,
                        password: passwordRef.current!.value,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            result = (await dataFetched.json()) as {
                message: string;
                token: string;
            };
            if (!dataFetched.ok) {
                throw new Error(result.message);
            }
        } catch (error) {
            if (error instanceof Error) {
                setIsError({ status: true, message: error.message });
            }
            setIsError({
                status: true,
                message: (error as { message: string }).message,
            });
            setIsLoading(false);
            return;
        }
        setIsLoading(false);
        setConfirmAlert(true);
        dispatch(loginActions.login(result.token));
    };

    if (isLoggedIn) {
        return <Navigate to="/order" />;
    }
    return (
        <Container className={classes.loginContainer}>
            {isError.status && (
                <Alert variant="warning">{isError.message}</Alert>
            )}
            {showConfirmAlert && (
                <Alert variant="primary">Autenticato con successo.</Alert>
            )}
            <Card style={{ width: '20rem' }}>
                <Card.Body>
                    <h4>Login</h4>
                </Card.Body>
                <Form className={classes.formStyle} onSubmit={sendLogin}>
                    <FormGroup>
                        <FormLabel>Username</FormLabel>
                        <FormControl
                            type="text"
                            ref={usernameRef}
                            required
                            placeholder="Username"
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Password</FormLabel>
                        <FormControl
                            type="password"
                            ref={passwordRef}
                            required
                            placeholder="Password"
                        />
                    </FormGroup>
                    <div style={{ width: '78%' }} className="d-grid gap-2">
                        <Button
                            className="mb-3 mt-3"
                            variant="primary"
                            type="submit"
                        >
                            {!isLoading && 'Invia'}
                            {isLoading && (
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            )}
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};
export default Login;
