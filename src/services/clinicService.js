import { where } from "sequelize";
import db from "../models/index";
import _ from "lodash";
require("dotenv").config();

let createNewClinicService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.address ||
        !data.previewImg ||
        !data.contentHTML ||
        !data.contentMarkdown ||
        !data.nameClinic
      ) {
        resolve({
          status: 400,
          message: "Bad request. Missing a parameters",
        });
      } else {
        await db.Clinic.create({
          name: data.nameClinic,
          address: data.address,
          image: data.previewImg,
          descriptionMarkdown: data.contentMarkdown,
          descriptionHTML: data.contentHTML,
        });
        resolve({
          status: 200,
          message: "Create clinic success!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllClinicService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll();

      if (data?.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
          return item;
        });
      }

      resolve({
        status: 200,
        message: "Get clinic success!",
        data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailClinicByIdService = (id, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || !location) {
        resolve({
          status: 400,
          message: "Bad request. Missing a parameters",
        });
      } else {
        let data = await db.Clinic.findOne({
          where: { id },
          attributes: ["descriptionHTML", "descriptionMarkdown"],
          include: [
            {
              model: db.Doctor_Infor,
              as: "doctorInfoData",
              attributes: ["doctorId", "provinceId"],
              where: location !== "ALL" && { provinceId: location },
            },
          ],
          raw: false,
          nest: true,
        });

        resolve({
          status: 200,
          message: "Get detail clinic success!",
          data: data ? data : {},
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createNewClinicService,
  getAllClinicService,
  getDetailClinicByIdService,
};
