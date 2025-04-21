const { validateToken } = require("../services/authentication");

function checkForauthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];

    if (!tokenCookieValue) {
      return next(); // ✅ early return to prevent double next()
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {
      // If token is invalid, optionally log or handle it
      console.error("Invalid token:", error.message);
    }

    return next(); // ✅ only one next() called here
  };
}

module.exports = {
  checkForauthenticationCookie,
};
