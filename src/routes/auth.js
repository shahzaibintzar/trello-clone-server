const express = require("express");
const router = express.Router();
const User = require("../models/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 8);
  try {
    const existingEmail = await User.findOne({email : req.body.email})
    if(existingEmail){
      return res.status(400).json({ message: "User already exist" });
    }
      const userData = new User({
        name:req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
    const user = await userData.save();
    res.status(200).json({ message: "User registered successfuly!", user });
  } catch (error) {
    res.status(400).json({ message: "User cannot registered", error });
  }
});
 

// LOGIN

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  console.log("user : ", user);

  if (!user) {
    return res.status(404).json({ message: "Authentication failed" });
  }

  const passwordMatched = await bcrypt.compare(
    req.body.password,
    user.password
  );

  console.log("passwordMatched : ", passwordMatched);

  if (!passwordMatched) {
    return res.status(404).json({ message: "Authentication failed" });
  }

  var token = jwt.sign({ id: user._id, admin: false,email:user.email }, process.env.SECRET_KEY);

  res.cookie("token", token,{ httpOnly: true });

  return res.status(200).json({ message: "User logged in!", token });
});

module.exports = router;
//PROTECTED

router.get("/protected", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
  return res.status(404).json({ message: "No token avalible" });
  }

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    res.status(200).json({ message:" User Logged In ", user: decode});
  } catch (error) {
    return res.status(500).json({ message:"Unauthenticated  tokken"});
  }
});



// LOGOUT
router.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out!" });
});



// GET

router.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({users , message:" User Show Sucessfully "});
  } catch (error) {
    return res.status(500).json({ message:" No User  " , error});
  }
});
module.exports = router;


//GET PROFILE

router.get("/profile", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token , process.env.SECRET_KEY)
  const email = decode.email;
  const users = await User.find({email: email});
  res.status(200).json({users , message:"Profile Display successfully"});
});
module.exports = router;

// UPDATE PROFILE

router.put('/updateProfile/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUserData = req.body;
          if (updatedUserData.password) {
         updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });
        res.status(200).json({ user: updatedUser, message: "Profile updated successfully" });
    } catch (error) {
        res.status(400).json(error);
    }
});


