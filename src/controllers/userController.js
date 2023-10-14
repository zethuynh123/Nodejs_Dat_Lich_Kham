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

let handleGetAllUser = async (req, res) => {
  let id = req.query.id;
  let users = await userService.getAllUser(id);

  if (!id) {
    return res.status(400).json({
      status: 400,
      message: "Missing an id user",
    });
  }
  return res.status(200).json({
    status: 200,
    message: "get users success",
    dataUser: users,
  });
};

let handleCreateUser = async (req, res) => {
  let result = await userService.createNewUser(req.body);

  return res.status(result.status).json(result);
};
let handleEditUser = async (req, res) => {
  let result = await userService.editUser(req.body);
  return res.status(result.status).json(result);
};

let handleDeleteUser = async (req, res) => {
  if (!req.query.id) {
    res.status(400).json({
      status: 400,
      message: "Bad request. Missing an id user",
    });
  }
  let result = await userService.deleteUser(req.query.id);

  return res.status(result.status).json(result);
};

let getAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCode(req.query.type);
    return res.status(data.status).json(data);
  } catch (error) {
    return res.status(400).json({
      status: 500,
      message: "Can't connect to server",
    });
  }
};

module.exports = {
  handleLogin,
  handleGetAllUser,
  handleCreateUser,
  handleEditUser,
  handleDeleteUser,
  getAllCode,
};
