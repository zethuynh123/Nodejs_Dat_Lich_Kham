import { where } from "sequelize";
import db from "../models/index";
import _ from "lodash";
require("dotenv").config();

let createNewSpecialtyService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.previewImg ||
        !data.contentHTML ||
        !data.contentMarkdown ||
        !data.nameSpecialty
      ) {
        resolve({
          status: 400,
          message: "Bad request. Missing a parameters",
        });
      } else {
        await db.Specialty.create({
          name: data.nameSpecialty,
          image: data.previewImg,
          descriptionMarkdown: data.contentMarkdown,
          descriptionHTML: data.contentHTML,
        });
        resolve({
          status: 200,
          message: "Create specialty success!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllSpecialtyService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll();

      if (data?.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
          return item;
        });
      }

      resolve({
        status: 200,
        message: "Get specialty success!",
        data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailSpecialtyByIdService = (id, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || !location) {
        resolve({
          status: 400,
          message: "Bad request. Missing a parameters",
        });
      } else {
        let data = await db.Specialty.findOne({
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
          message: "Get detail specialty success!",
          data: data ? data : {},
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createNewSpecialtyService,
  getAllSpecialtyService,
  getDetailSpecialtyByIdService,
};
