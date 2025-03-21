// TODO: SET UP THE HOMESCREEN FOR USER (dashboard stuff)

import { useEffect, useState } from 'react';

const Home = () => {
    // auth
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const checkAuth = async () => {
        try {
            const response = await fetch('http://localhost:3000/home', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setIsAuthenticated(data.signedIn);
        }
        catch(err) {
            console.error("Auth check error:", err);
            setIsAuthenticated(false);
        }
    };
    // check on mount and every 1 second (for debugging)
    useEffect(() => {
        checkAuth();
        const interval = setInterval(checkAuth, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div>Auth Status: {isAuthenticated ? "Logged In" : "Not Logged In"}</div>
            {isAuthenticated ? (
                <h1>Welcome back!</h1>
            ) : (
                <h1>Please log in.</h1>
            )}
        </div>
    );
};

export default Home;