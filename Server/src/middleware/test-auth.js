// Test file to verify authentication middleware
// This file can be removed after testing

import jwt from 'jsonwebtoken';

// Helper function to generate test JWT token
export const generateTestToken = (userId, status = 'approved', role = 'member') => {
    const payload = {
        userId,
        status,
        role
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

// Test middleware functionality
export const testAuthMiddleware = () => {
    console.log('Testing authentication middleware...');
    
    // Test token generation
    const testToken = generateTestToken('test-user-id', 'approved', 'member');
    console.log('Generated test token:', testToken);
    
    // Test token verification
    try {
        const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
        console.log('Token verification successful:', decoded);
        return true;
    } catch (error) {
        console.error('Token verification failed:', error);
        return false;
    }
};
