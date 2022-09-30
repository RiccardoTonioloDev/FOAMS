import { useRef, useState } from 'react';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import classes from './searchComponent.module.css';

type SearchComponentProps = {
    title: string;
};
const SearchComponent = (props: SearchComponentProps) => {
    const [invalidInput, setInvalidInput] = useState(false);
    const logged = useSelector((state: RootState) => state.login.logged);
    const navigate = useNavigate();
    const numberInputRef = useRef<HTMLInputElement>(null);
    const onClickHandler = () => {
        setInvalidInput(false);
        const orderId = numberInputRef.current!.value;
        if (!orderId || +orderId < 0) {
            setInvalidInput(true);
            return;
        }
        navigate(orderId, { replace: false });
    };
    if (!logged) {
        return <Navigate to="/order" />;
    }

    return (
        <Container className={classes.containerStyling}>
            <h4>{props.title}</h4>
            <Card className={classes.cardStyling} style={{ width: '18rem' }}>
                <h6 className="m-3">Order id:</h6>
                <Form.Group as={Col} md="6" className="mb-2">
                    <Form.Control
                        ref={numberInputRef}
                        required
                        type="number"
                        placeholder="Order id"
                    />
                </Form.Group>
                <Button
                    onClick={onClickHandler}
                    variant="primary"
                    className="mb-2"
                >
                    Invia
                </Button>
            </Card>
            {invalidInput && (
                <Alert className="mt-5" variant="warning">
                    L'id inserito non è valido.
                </Alert>
            )}
        </Container>
    );
};

export default SearchComponent;
