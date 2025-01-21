const jwt = require('jsonwebtoken');


const protect = async (req, res, next) => {
  let token;
  if (req.headers.Authorization && req.headers.Authorization.startsWith("Bearer")) {
    token = req.headers.Authorization.split(" ")[1];
    
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) throw new Error("User not found");
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};


module.exports = protect;
