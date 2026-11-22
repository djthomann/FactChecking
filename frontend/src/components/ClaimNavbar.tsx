import { Link, useNavigate } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
} from 'reactstrap';
import { useMe } from '../hooks/useMe';
import { useLogout } from '../hooks/useLogout';

function ClaimNavbar({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) {

    const { data: me, isPending } = useMe();
    const logoutMutation = useLogout();
    const navigate = useNavigate();

    return (
        <header className="bg-brand" data-bs-theme="dark">
            <Navbar className="container main p-4 d-flex flex-column" expand="md">
                <NavbarBrand tag={Link} to="/">Share your Claim!</NavbarBrand>
                <Nav className="ms-auto gap-3" navbar>
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
                            <NavItem>
                            <NavLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    logoutMutation.mutate(undefined, { onSuccess: () => navigate("/") })
                                }}
                            >
                                <i className="bi bi-box-arrow-right me-1"></i>
                                Logout
                            </NavLink>
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