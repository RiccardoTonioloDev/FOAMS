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
                <Navbar bg="light" expand="lg">
                    <Container>
                        <NavbarBrand>
                            <NavLink
                                to="/order"
                                className={classes.navLinkBrand}
                            >
                                Food Ordering
                            </NavLink>
                        </NavbarBrand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link>
                                    <NavLink
                                        to="/order"
                                        className={(navData) =>
                                            navData.isActive
                                                ? classes.activeNavLink
                                                : classes.navLink
                                        }
                                    >
                                        Order
                                    </NavLink>
                                </Nav.Link>
                                <Nav.Link>
                                    <NavLink
                                        to="/confirm"
                                        className={(navData) =>
                                            navData.isActive
                                                ? classes.activeNavLink
                                                : classes.navLink
                                        }
                                    >
                                        Confirm
                                    </NavLink>
                                </Nav.Link>
                                <Nav.Link>
                                    <NavLink
                                        to="/stampa"
                                        className={(navData) =>
                                            navData.isActive
                                                ? classes.activeNavLink
                                                : classes.navLink
                                        }
                                    >
                                        Stampa
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
