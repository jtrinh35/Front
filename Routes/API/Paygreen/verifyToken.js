import dotenv from 'dotenv';

dotenv.config()
let i = 0
export const verifyToken = (req, res, next) =>{
    if(i < 2){
        // Store the original send function
        const originalSend = res.send;

        // Override the send function to intercept the response
        res.send = function (body) {
            // Log the response status code
            console.log('Response Status Code:', res.statusCode);

            // Check if the response status is 401
            if (res.statusCode === 401) {
                // Log the 401 response
                console.log('Unauthorized response intercepted');
                // Send a custom error response
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Call the original send function to send the response
            originalSend.call(this, body);
        };

        // Continue processing the request
        next();
        i++
    }

}

