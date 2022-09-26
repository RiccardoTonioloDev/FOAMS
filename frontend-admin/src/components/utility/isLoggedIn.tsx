import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { loginActions } from '../../store/login-slice';

type IsLoggedInProps = {
    children: ReactNode;
};
const IsLoggedIn = (props: IsLoggedInProps) => {
    const dispatch = useDispatch();
    const isLogged = useSelector((state: RootState) => state.login.logged);
    useEffect(() => {
        if (isLogged) {
            const msRemaining =
                Date.parse(localStorage.getItem('expirationDate')!) -
                Date.now();
            setTimeout(() => dispatch(loginActions.logout(null)), msRemaining);
        } else {
            dispatch(loginActions.logInIfFound(null));
        }
    }, [isLogged]);
    return <>{props.children}</>;
};
export default IsLoggedIn;
