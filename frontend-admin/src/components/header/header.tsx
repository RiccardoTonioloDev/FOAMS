import { ReactNode } from 'react';
import {
    Container,
    Nav,
    Navbar,
    NavbarBrand,
    NavDropdown,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import classes from './header.module.css';
import { RootState } from '../../store/index';
import { loginActions } from '../../store/login-slice';

type HeaderProps = {
    children: ReactNode;
};
const Header = (props: HeaderProps) => {
    const isLoggedIn = useSelector((state: RootState) => state.login.logged);
    const dispatch = useDispatch();
    const onLogoutHandler = () => {
        dispatch(loginActions.logout(null));
    };
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
                            <Nav
                                className="justify-content-end"
                                style={{ width: '100%' }}
                            >
                                <Nav.Link as="div" eventKey={1}>
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
                                {isLoggedIn && (
                                    <Nav.Link as="div" eventKey={2}>
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
                                )}
                                {isLoggedIn && (
                                    <Nav.Link as="div" eventKey={3}>
                                        <NavLink
                                            to="/print"
                                            className={(navData) =>
                                                navData.isActive
                                                    ? classes.activeNavLink
                                                    : classes.navLink
                                            }
                                        >
                                            Stampa ordine
                                        </NavLink>
                                    </Nav.Link>
                                )}
                                {isLoggedIn && (
                                    <NavDropdown
                                        title="Aggiungi"
                                        id="basic-nav-dropdown"
                                    >
                                        <NavDropdown.Item>
                                            <Link
                                                to="/add-food"
                                                className={classes.navLink}
                                            >
                                                Cibo
                                            </Link>
                                        </NavDropdown.Item>
                                        <NavDropdown.Item>
                                            <Link
                                                to="/add-ingredient"
                                                className={classes.navLink}
                                            >
                                                Ingredienti
                                            </Link>
                                        </NavDropdown.Item>
                                        <NavDropdown.Item>
                                            <Link
                                                to="/add-liquid"
                                                className={classes.navLink}
                                            >
                                                Bevande
                                            </Link>
                                        </NavDropdown.Item>
                                        <NavDropdown.Item>
                                            <Link
                                                to="/add-quantity"
                                                className={classes.navLink}
                                            >
                                                Quantità
                                            </Link>
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                )}
                                {isLoggedIn && (
                                    <Nav.Link as="div" eventKey={3}>
                                        <NavLink
                                            to="/delete"
                                            className={(navData) =>
                                                navData.isActive
                                                    ? classes.activeNavLink
                                                    : classes.navLink
                                            }
                                        >
                                            Elimina
                                        </NavLink>
                                    </Nav.Link>
                                )}
                                {!isLoggedIn && (
                                    <Nav.Link
                                        onClick={onLogoutHandler}
                                        as="div"
                                        eventKey={3}
                                    >
                                        <NavLink
                                            to="/login"
                                            className={(navData) =>
                                                navData.isActive
                                                    ? classes.activeNavLink
                                                    : classes.navLink
                                            }
                                        >
                                            <svg
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-lock"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
                                            </svg>
                                        </NavLink>
                                    </Nav.Link>
                                )}
                                {isLoggedIn && (
                                    <Nav.Link
                                        onClick={onLogoutHandler}
                                        as="div"
                                        eventKey={3}
                                    >
                                        <NavLink
                                            to="/"
                                            className={classes.navLink}
                                        >
                                            Logout
                                        </NavLink>
                                    </Nav.Link>
                                )}
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
