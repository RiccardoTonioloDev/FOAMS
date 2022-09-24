import { ReactNode } from 'react';
import { Container, Nav, Navbar, NavbarBrand } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import classes from './header.module.css';

type HeaderProps = {
    children: ReactNode;
};
const Header = (props: HeaderProps) => {
    return (
        <>
            <header>
                <Navbar collapseOnSelect bg="light" expand="lg">
                    <Container>
                        <NavbarBrand>
                            <NavLink
                                to="/order"
                                className={classes.navLinkBrand}
                            >
                                <img
                                    alt=""
                                    src="/logoDuomo.png"
                                    width="30"
                                    height="30"
                                    className="d-inline-block align-top"
                                />
                                Food Ordering
                            </NavLink>
                        </NavbarBrand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link eventKey={1}>
                                    <NavLink
                                        to="/order"
                                        className={(navData) =>
                                            navData.isActive
                                                ? classes.activeNavLink
                                                : classes.navLink
                                        }
                                    >
                                        Crea un ordine
                                    </NavLink>
                                </Nav.Link>
                                <Nav.Link eventKey={2}>
                                    <NavLink
                                        to="/confirm"
                                        className={(navData) =>
                                            navData.isActive
                                                ? classes.activeNavLink
                                                : classes.navLink
                                        }
                                    >
                                        Conferma ordine
                                    </NavLink>
                                </Nav.Link>
                                <Nav.Link eventKey={3}>
                                    <NavLink
                                        to="/stampa"
                                        className={(navData) =>
                                            navData.isActive
                                                ? classes.activeNavLink
                                                : classes.navLink
                                        }
                                    >
                                        Stampa ordine
                                    </NavLink>
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
            <main>
                <Container>{props.children}</Container>
            </main>
        </>
    );
};
export default Header;
