import React from 'react';
import { Link } from 'react-router-dom';

const HeaderProduct = () => {

    return (
        <header>
            <div className="rowbackscan">
                <div className="leftheaderbackscan">
                    <Link id="link_scan" to ="/cart">
                        <img id="logoback" src="/images/back2.png" alt="scan" />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default HeaderProduct;