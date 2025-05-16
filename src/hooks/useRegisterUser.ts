import { useEffect } from "react";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

//register user hook that saves users in db when he visits the site
export const useRegisterUser = () => {
    useEffect(() => {
        const init = async () => {
            const userRegistered = localStorage.getItem('user_registered');
            if (userRegistered)
                return;

            const fp = await FingerprintJS.load();
            const result = await fp.get();
            const visitorId = result.visitorId;
            localStorage.setItem('fingerprintId', visitorId);

            const res = await fetch('/api/registerUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visitorId }),
            });
            if (res.ok) {
                localStorage.setItem('user_registered', 'true');
                console.log("User registered successfully");
            } 
            else {
                console.error("User registration failed");
            }
        };
        init();
    }, []);
};
