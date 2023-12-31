import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, question } = req.body;
    //validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "email is required" });
    }
    if (!password) {
      return res.send({ message: "password is required" });
    }
    if (!phone) {
      return res.send({ message: "phone is required" });
    }
    if (!address) {
      return res.send({ message: "addess is required" });
    }
    if (!question) {
      return res.send({ message: "question is required" });
    }
    // check user
    const existinguser = await userModel.findOne({ email });
    //existing user
    if (existinguser) {
      return res.status(200).send({
        success: false,
        message: "already Registered please login ",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      question,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Zamn! there are some errror in registration",
      error,
    });
  }
};

//POST Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not regitered bruh",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        sucess: false,
        message: "Invalid  Password ",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_secret, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successfullly",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//forgot password controller
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, question, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "email is required" });
    }
    if (!question) {
      res.status(400).send({ message: "question is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "newPassword is required" });
    }
    //check
    const user = await userModel.findOne({ email, question });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wronge emeil or answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, {
      password: hashed,
    });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  res.send("protected route");
};
