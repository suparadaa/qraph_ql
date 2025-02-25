
const user = "admin";
const key = "123456";


const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res.status(401).json({ error: "Unauthorized: No credentials provided" });
    }
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");
  
    if (username !== user || password !== key) {
      return res.status(403).json({ error: "รหัสผิด" });
    }
    req.user = { username };
    next();
  };
  
  module.exports = basicAuth;