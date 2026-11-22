import { Link } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
} from 'reactstrap';
import { useMe } from '../hooks/useMe';

function ClaimNavbar({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) {

    const { data: me, isPending } = useMe();

    return (
        <header className="bg-brand" data-bs-theme="dark">
            <Navbar className="container main p-4 d-flex flex-column" expand="md">
                <NavbarBrand tag={Link} to="/">Share your Claim!</NavbarBrand>
                <Nav className="ms-auto" navbar>
                    <NavItem>
                        <NavLink tag={Link} to="/browse">Browse</NavLink>
                    </NavItem>
                    {me ? (
                        <>
                            <NavItem>
                                <NavLink tag={Link} to="/contribute">Contribute</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to="/account">Account</NavLink>
                            </NavItem>
                        </>
                        ) : (
                        <NavItem>
                            <NavLink tag={Link} to="/login">Login</NavLink>
                        </NavItem>
                        )}
                    <NavItem>
                        <Button
                                color="link"
                                className="text-body"
                                onClick={() => toggleTheme()}
                                title={theme === "dark" ? "Light mode" : "Dark mode"}
                            >
                            <i className={`bi ${theme === "dark" ? "bi-sun" : "bi-moon-stars"}`} />
                        </Button>
                    </NavItem>
                </Nav>
            </Navbar>
        </header>
    );
}

export default ClaimNavbar;