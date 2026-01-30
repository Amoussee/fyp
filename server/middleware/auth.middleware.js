// middleware/auth.middleware.js

// TEMPORARY MOCK AUTH
// Later, you will replace this function with the real AWS Cognito verifier.
export const authenticateUser = (req, res, next) => {
    // 1. Simulate a logged-in user
    req.user = {
        id: 1, // Assume "User ID 1" is always logged in for testing
        role: 'admin',
        school_id: 5
    };

    console.log(`[MOCK AUTH] Request by User ID: ${req.user.id}`);
    next();
};