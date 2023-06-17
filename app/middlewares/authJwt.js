    const jwt = require("jsonwebtoken");
    const config = require("../config/auth.config.js");
    const db = require("../models");
    const User = db.user;
    const Role = db.role;

    verifyToken = (req, res, next) => {
      const tokenWithBearer = req.headers.authorization;
      const token = tokenWithBearer.substring(7);
      console.log("token here");
      console.log(token);
      if (!token) {
        return res.status(403).send({ message: "No token provided!" });
      }
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          console.error("Error verifying token:", err);
          return res.status(401).send({ message: "Unauthorized!" });
        }
        console.log("Decoded token:", decoded); 
        req.userId = decoded.id;
        next();
      });
    };
    isAdmin = (req, res, next) => {
      User.findById(req.userId).exec((err, user) => {
        if (err) {
          console.error("Error finding user:", err);
          res.status(500).send({ message: err });
          return;
        }
        console.log("Retrieved user:", user); 
        Role.find(
          {_id: { $in: user.roles }
        },
          (err, roles) => {
            if (err) {
              console.error("Error finding roles:", err); // Log the error for debugging purposes
              res.status(500).send({ message: err });
              return;
            }
            for (let i = 0; i < roles.length; i++) {
              if (roles[i].name === "admin") {
                next();
                return;
              }
            }
            res.status(403).send({ message: "Require Admin Role!" });
            return;
          }
        );
      });
    };

    const authJwt = {
      verifyToken,
      isAdmin,
    };
    module.exports = authJwt;
