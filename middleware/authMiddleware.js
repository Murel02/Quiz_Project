module.exports = (req, res, next) => {
    // Check if the user is logged in by verifying the session's `userId`
    if (!req.session.userId) {
        return res.redirect('/login'); // Redirect to the login page if not authenticated
    }

    // If authenticated, proceed to the next middleware or route handler
    next();
};