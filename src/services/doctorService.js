import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let getTopDoctor = async (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        limit,
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });

      resolve({
        status: 200,
        data: doctors,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getTopDoctor,
};
