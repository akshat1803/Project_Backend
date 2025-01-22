import jwt from "jsonwebtoken";
import User from "../src/models/User.js"

const protect = async (req, res, next) => {
  let token = req.cookies.token;
  // console.log("cookies", req.cookies);
  // console.log("token", token);

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded", decoded);
    req.user = await User.findById(decoded.id).select("-password");
    // console.log(req.user);
    if (!req.user) throw new Error("User not found");
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid", error: err.message });
  }
};

export default protect;
