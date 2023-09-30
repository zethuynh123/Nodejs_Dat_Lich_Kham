import db from "../models/index";
import bcrypt from "bcryptjs";

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

module.exports = { handleCheckLogin };
