const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { responseHandler } = require("express-intercept");
// File Upload
const multer = require("multer");
const path = require("path");
const redisClient = require("../redis");
const UserModel = require("../models/user");
const { roles } = require("../models/permission");



require('dotenv').config()



const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Authentication failed" });
  }
  const extract = token.split(" ")[1];
  const decoded = jwt.verify(extract, process.env.JWT_SECRET);
  const user = await UserModel.findById(decoded.id);
  req.user = user;
  next();
});
const verifyRefresh = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Authentication failed" });
  }
  const extract = token.split(" ")[1];
  console.log(process.env.JWT_REFRESH_SECRET)
  const decoded = jwt.verify(extract, process.env.JWT_REFRESH_SECRET);
  const user = await UserModel.findById(decoded.id);
  // console.log(user)
  req.user = { ...user._doc, extract };
  // console.log(req.user)
  next();
});

function logger(req, res, next) {
  // console.log(req)
  console.log("Incoming request", req.rawHeaders[3]);
  // Example, request from unauthorized user
  // return res.status(404).send("Forbidden")
  next();
}

function authroize(req, res, next) {
  return res.status(404).json({
    msg: "Not Found",
  });
}

function handleError(error, req, res, next) {
  // console.log("Hello")
  // console.log(error.message)
  return res.status(500).json(error.message);
}

function checkId(req, res, next) {
  const id = req.params.id;
  const site = sites.find((item) => {
    return item.id == id;
  });
  if (!course) {
    return res.status(404).json({
      error: "Resource Not Found",
    });
  }
  next();
}

function handleValidation(req, res, next) {
  //console.log("Hello")
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

const catchInterceptor = (ttl) =>
  responseHandler()
    .for((req) => req.method === "GET")
    .if((res) => {
      const validStatusCodes = [200, 201, 202, 203, 204];
      return validStatusCodes.includes(res.statusCode);
    })
    .getString(async (body, req, res) => {
      try {
        const { originalUrl } = res.req;
        await redisClient.set(originalUrl, body, {
          EX: ttl,
        });
      } catch (error) {
        console.error("Error setting cache:", error);
      }
    });

const invalidateInterceptor = responseHandler()
  .for((req) => {
    const modifyingMethods = ["POST", "PUT", "PATCH", "DELETE"];
    return modifyingMethods.includes(req.method);
  })
  .if((res) => {
    const validStatusCodes = [200, 201, 202, 203, 204];
    return validStatusCodes.includes(res.statusCode);
  })
  .getString(async (body, req, res) => {
    try {
      const { baseUrl } = req;
      console.log("Base URL:", baseUrl);

      const keys = await redisClient.keys(`${baseUrl}*`);
      console.log("Keys to delete:", keys);

      if (keys.length > 0) {
        await Promise.all(keys.map((key) => redisClient.del(key)));
      }
    } catch (error) {
      console.error("Error invalidating cache:", error);
    }
  });

// const catchMiddleware = asyncHandler(async (req, res, next) => {
//   try {
//     if (req.method === "GET") {
//       const { originalUrl } = req;
//       const cachedData = await redisClient.get(originalUrl);

//       if (cachedData !== null) {
//         try {
//           return res.json(JSON.parse(cachedData));
//         } catch (error) {
//           console.error("Error parsing cached JSON:", error);
//         }
//       }
//     }
//     next();
//   } catch (error) {
//     console.error("Error in caching middleware:", error);
//     next(); // Ensure the request proceeds even if an error occurs
//   }
// });

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const singleUpload = multer({
  storage: storage,
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
}).single("file");

const multipleUploads = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
}).array("files");

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|pdf/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Error: Images Only!"), false);
}

const checkRole = (action, role) => {
  console.log(roles[role].permissions);
  return roles[role].permissions.includes(action);
};

const permission = (action) =>
  asyncHandler((req, res, next) => {
    const { user } = req;
    if (!checkRole(action, user.permission)) {
      return res.json({ msg: "Unauthorized" });
    }
    next();
  });

module.exports = {
  handleError,
  logger,
  verifyJWT,
  verifyRefresh,
  handleValidation,
  catchInterceptor,
  //catchMiddleware,
  invalidateInterceptor,
  singleUpload,
  multipleUploads,
  permission,
};
