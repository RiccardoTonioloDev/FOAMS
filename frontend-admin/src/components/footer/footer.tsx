const Footer = () => {
    return (
        <footer>
            <div
                style={{
                    display: 'flex',
                    flexFlow: 'column',
                    textAlign: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'lightgrey',
                    borderRadius: '9px 9px 0px 0px',
                }}
            >
                <span>
                    Made with ❤️ by{' '}
                    <a href="https://www.linkedin.com/in/riccardo-toniolo/">
                        Toniolo Riccardo
                    </a>
                    .
                </span>
                <span>
                    Find the code{' '}
                    <a href="https://github.com/RiccardoTonioloDev/FOAMS">
                        here
                    </a>
                    .
                </span>
            </div>
        </footer>
    );
};
export default Footer;
