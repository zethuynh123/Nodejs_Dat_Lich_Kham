import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let handleCheckLogin = async (email, password) => {
  let isEmailExist = await checkEmailLogin(email);
  console.log("a", isEmailExist);
  if (isEmailExist) {
    let user = await db.User.findOne({
      where: { email },
    });
    if (user) {
      let check = await bcrypt.compareSync(password, user.password);
      if (check) {
        return {
          status: 200,
          message: "Checked sussccess!",
          dataUser: {
            email: user.email,
            firstName: user.firstName,
            lastname: user.lastName,
            gender: user.gender ? "1" : "0",
            address: user.address,
            phone: user.phoneNumber,
            roleId: user.roleId,
          },
        };
      } else {
        return {
          status: 400,
          errMessage: "Wrong password",
        };
      }
    } else {
      return {
        status: 400,
        message: "User isn't exist",
      };
    }
  } else {
    return {
      status: 400,
      errMessage: "Email isn't exist",
    };
  }
};

let checkEmailLogin = (email) => {
  return new Promise((resolve, reject) => {
    db.User.findOne({ where: { email }, raw: true })
      .then((result) => {
        if (result) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
};

let getAllUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = {};
      if (id === "All") {
        users = await db.User.findAll({
          attributes: { exclude: ["password"] },
        });
      }
      if (id && id !== "All") {
        users = await db.User.findOne({
          where: { id },
          attributes: { exclude: ["password"] },
        });
      }
      console.log("users", users);
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email) {
        resolve({
          status: 400,
          message: "Bad request. Misssing an email",
        });
      } else {
        let isExistEmail = await checkEmailLogin(data.email);

        if (isExistEmail) {
          resolve({
            status: 202,
            message: "Email is already exists",
          });
        }
      }

      let hashPassBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPassBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });
      resolve({
        status: 200,
        message: "Create user success",
      });
    } catch (error) {
      reject(error);
    }
  });
};

let editUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("data", data);
      let userId = data.id;
      if (userId) {
        let userQuery = await db.User.findOne({ where: { id: userId } });
        if (userQuery) {
          await db.User.update(
            {
              firstName: data.firstName,
              lastName: data.lastName,
              address: data.address,
              phoneNumber: data.phoneNumber,
              gender: data.gender === "1" ? true : false,
            },
            { where: { id: userId } }
          );
          resolve({
            status: 200,
            message: "Edit user success",
          });
        } else {
          resolve({
            status: 202,
            message: "User isn't exist",
          });
        }
      } else {
        resolve({
          status: 400,
          message: "Bad request. Missing an id user",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

let deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findOne({ where: { id } });
      if (!users) {
        resolve({
          status: 200,
          message: "User isn't exist ",
        });
      } else {
        await db.User.destroy({ where: { id } });
        resolve({
          status: 200,
          message: "Delete user success",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleCheckLogin,
  getAllUser,
  createNewUser,
  editUser,
  deleteUser,
};
