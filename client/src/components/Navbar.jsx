import React from "react";
import logo from "./../assets/logo.png";

function Navbar() {
    return (
        <nav>
            <div className="logo">
                <img src={logo} alt="" srcset="" />
            </div>
            <div className="context">
                <h1>การปลูกพืชในโรงเรือน</h1>
            </div>
        </nav>
    );
}

export default Navbar;
