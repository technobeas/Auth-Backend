const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register code :
exports.register = async (req, res) => {
  try {
    console.log("API Res : ", req.body);
    const { name, email, password } = req.body;

    // checking empty fields :
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required...!",
      });
    }

    // Checking if user Already Exist :
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Registerd...!",
      });
    }

    // Here we Are Hashing Password :
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating user
    const newUser = User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User Registerd...!",
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "SomeThing Went Wrong...!",
    });
  }
};

// login code
exports.login = async (req, res) => {
  // console.log("req : " ,req)
  try {
    console.log("API Res : ", req.body);
    const { email, password } = req.body;

    // checking empty fields :
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required...!",
      });
    }

    // getting uesr from db :
    const user = await User.findOne({ email });

    // check For Email :
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials...!",
      });
    }

    // Check For Password :
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials...!",
      });
    }

    // creating token :
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // make user login
    return res.json({
      token,
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "SomeThing Went Wrong...!",
    });
  }
};

// profile code : 
exports.profile = async (req, res) => {
  try {
    // const token = req.headers.authorization?.split(" ")[1];
    // if (!token)
    //   return res.status(401).json({
    //     message: "Not authorized",
    //   });

    // //  verify the token : 
    // jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    //   const user = await User.findById(decode?.id);
    //   return res.status(201).json({
    //     status: true,
    //     message: "Profile Data...!",
    //     data: token,
    //   });
    // });

    // return res.status(201).json({
    //   status: true,
    //   message: "Profile Data...!",
    //   data: token,
    // });

    // we have seprated the protected route logic to isLoggedIn

    return res.status(200).json({
      success: true,
      message: "Profile data",
      user: req.user, // comes from middleware
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "SomeThing Went Wrong...!",
    });
  }
};
