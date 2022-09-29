import React, { useRef } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import classes from './addItemForm.module.css';

type AddItemFromProps = {
    titleForm: string;
    type: 'ingredient' | 'liquid';
    isLoading: boolean;
    onClick: (nome: string, secondProperty: number) => void;
};

const AddItemForm = (props: AddItemFromProps) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    let errorMessage;
    const onClickHandler = (event: React.FormEvent) => {
        event.preventDefault();
        const name = nameRef.current!.value;
        let secondProperty =
            props.type === 'ingredient'
                ? +quantityRef.current!.value
                : +priceRef.current!.value;
        if (secondProperty < 10 && props.type === 'ingredient') {
            secondProperty = 10;
        }
        if (!name) {
            errorMessage = 'Inserire un nome valido';
        }
        if (!secondProperty && props.type === 'liquid') {
            errorMessage =
                props.type === 'liquid' && 'Inserire un prezzo valido';
        }
        props.onClick(name, secondProperty);
    };

    return (
        <div className={classes.cardFormStyling}>
            {errorMessage && <Alert variant="warning">{errorMessage}</Alert>}
            <Card className={classes.cardInternalStyling}>
                <Card.Title>{props.titleForm}</Card.Title>
                <Form onSubmit={onClickHandler}>
                    <Form.Group>
                        <Form.Label>Nome:</Form.Label>
                        <Form.Control
                            ref={nameRef}
                            required
                            type="text"
                            placeholder="Nome"
                        />
                    </Form.Group>
                    {props.type === 'ingredient' && (
                        <Form.Group>
                            <Form.Label>Quantità inventario:</Form.Label>
                            <Form.Control
                                ref={quantityRef}
                                required
                                type="number"
                                placeholder="Quantità"
                            />
                            <Form.Text className="text-muted">
                                I valori sotto "10" verranno automaticamente
                                portati a 10. Questo perchè i cibi con meno di
                                10 in Quantità non verranno mostrati, per
                                evitare richieste non concedibili.
                            </Form.Text>
                        </Form.Group>
                    )}
                    {props.type === 'liquid' && (
                        <Form.Group>
                            <Form.Label>Prezzo:</Form.Label>
                            <Form.Control
                                ref={priceRef}
                                required
                                type="number"
                                step="0.01"
                                placeholder="Prezzo"
                            />
                        </Form.Group>
                    )}
                    <div className={classes.buttonInTheMiddle}>
                        <Button
                            type="submit"
                            variant="primary"
                            style={{ marginTop: '1rem' }}
                        >
                            {props.isLoading ? (
                                <Spinner animation="border" role="status" />
                            ) : (
                                'Invia'
                            )}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};
export default AddItemForm;
