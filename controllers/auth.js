const Admin = require("../model/Admin");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// @desc      GET CURRENT LOGGED IN USER
// @route     GET api/auth/user
// @access    Private
exports.getUserAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc      GET USERS
// @route     GET api/auth/users
// @access    Private
exports.getUsers = async (req, res, next) => {
  try {
    const user = await User.find();

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc      AUTHENTICATE USER AND GET TOKEN
// @route     POST api/auth/user
// @access    Public
exports.postUserAuth = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        return res.status(201).json({
          success: true,
          data: token,
        });
      }
    );
  } catch (err) {
    if (err.name === "ValidationError") {
      const msgs = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: msgs,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
};

// @desc      GET CURRENT LOGGED IN ADMIN
// @route     GET api/auth/admin
// @access    Private
exports.getAdminAuth = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");

    return res.status(200).json({ success: true, data: admin });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc      AUTHENTICATE ADMIN AND GET TOKEN
// @route     POST api/auth/admin
// @access    Public
exports.postAdminAuth = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await Admin.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        return res.status(201).json({
          success: true,
          data: token,
        });
      }
    );
  } catch (err) {
    if (err.name === "ValidationError") {
      const msgs = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: msgs,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
};

//@desc     Allocate Course
//@route    PUT /api/auth/allocate/:id
//@access   Private
exports.allocateCourse = async (req, res, next) => {
  const { course_allocated } = req.body;

  try {
    let user = await User.findById(req.params.id);

    const newExp = {
      course_allocated,
    };

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: newExp },
      { new: true }
    );

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

//@desc     DELETE USER
//@route    DELETE /api/auth/:id
//@access   Private
exports.deleteUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      res
        .status(400)
        .json({ msg: `User with this ${req.params.id} Id does not exist` });
    }

    await User.findByIdAndRemove(req.params.id);

    return res
      .status(200)
      .json({ success: true, msg: "User was deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
