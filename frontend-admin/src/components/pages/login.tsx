import {
    Button,
    Card,
    Container,
    Form,
    FormControl,
    FormGroup,
    FormLabel,
} from 'react-bootstrap';
import classes from './login.module.css';

const Login = () => {
    return (
        <Container className={classes.loginContainer}>
            <Card style={{ width: '20rem' }}>
                <Card.Body>
                    <h4>Login</h4>
                </Card.Body>
                <Form
                    className={classes.formStyle}
                    onSubmit={(event) => event.preventDefault()}
                >
                    <FormGroup>
                        <FormLabel>Username</FormLabel>
                        <FormControl
                            type="text"
                            required
                            placeholder="Username"
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Password</FormLabel>
                        <FormControl
                            type="password"
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
                            Invia
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};
export default Login;
