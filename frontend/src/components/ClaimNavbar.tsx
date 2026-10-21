import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
} from 'reactstrap';

function ClaimNavbar() {
    const [dark, setDark] = useState(false);

    return (
        <header className="bg-brand" data-bs-theme="dark">
            <Navbar className="container main p-4 d-flex flex-column" expand="md">
                <NavbarBrand tag={Link} to="/">Share your Claim!</NavbarBrand>
                <Nav className="ms-auto" navbar>
                    <NavItem>
                        <NavLink tag={Link} to="/claims">Claims</NavLink>
                    </NavItem>
                    <NavItem>
                        <Button
                                color="link"
                                className="text-body"
                                onClick={() => setDark((d) => !d)}
                                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                                title={dark ? "Light mode" : "Dark mode"}
                            >
                                <i className={`bi ${dark ? "bi-sun" : "bi-moon-stars"}`} />
                            </Button>
                    </NavItem>
                </Nav>
            </Navbar>
        </header>
    );
}

export default ClaimNavbar;