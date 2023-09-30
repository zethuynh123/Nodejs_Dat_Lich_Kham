import db from "../models/index";
import userService from "../services/userService";

let handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      message: "Bad request",
    });
  }
  let userData = await userService.handleCheckLogin(email, password);
  console.log("userData", userData);
  if (userData.status === 200) {
    return res.status(200).json({
      status: userData.status,
      message: userData.message,
      dataUser: userData.dataUser,
    });
  } else {
    return res.status(400).json({
      status: userData.status,
      message: userData.errMessage,
    });
  }
};

module.exports = {
  handleLogin,
};
