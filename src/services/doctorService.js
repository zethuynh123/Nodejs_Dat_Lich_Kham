import db from "../models/index";
import bcrypt from "bcryptjs";
import _ from "lodash";
require("dotenv").config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

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

let getAllDoctor = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctor = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });
      resolve({
        status: 200,
        data: doctor,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let saveInfoDoctor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.doctorId ||
        !data.contentMarkdown ||
        !data.contentHTML ||
        !data.action ||
        !data.selectedPrice ||
        !data.selectedMethod ||
        !data.selectedProvince ||
        !data.nameClinic ||
        !data.addressClinic
      ) {
        resolve({
          status: 400,
          message: "Bad request. Missing parameters",
        });
      } else {
        //upsert to markdown
        if (data.action === "ADD") {
          await db.Markdown.create({
            contentHTML: data.contentHTML,
            contentMarkdown: data.contentMarkdown,
            description: data.description,
            doctorId: data.doctorId,
          });
        }

        if (data.action === "EDIT") {
          await db.Markdown.update(
            {
              contentHTML: data.contentHTML,
              contentMarkdown: data.contentMarkdown,
              description: data.description,
            },
            {
              where: {
                doctorId: data.doctorId,
              },
            }
          );
        }

        //upsert to Doctor_Infor
        let doctorInfo = await db.Doctor_Infor.findOne({
          where: { doctorId: data.doctorId },
        });

        if (doctorInfo) {
          await db.Doctor_Infor.update(
            {
              doctorId: data.doctorId,
              priceId: data.selectedPrice,
              provinceId: data.selectedProvince,
              paymentId: data.selectedMethod,
              nameClinic: data.nameClinic,
              addressClinic: data.addressClinic,
              note: data.note,
            },
            {
              where: {
                doctorId: data.doctorId,
              },
            }
          );
        } else {
          await db.Doctor_Infor.create({
            doctorId: data.doctorId,
            priceId: data.selectedPrice,
            provinceId: data.selectedProvince,
            paymentId: data.selectedMethod,
            nameClinic: data.nameClinic,
            addressClinic: data.addressClinic,
            note: data.note,
          });
        }

        resolve({
          status: 200,
          message: "Save info doctor success",
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let getDetailDoctorById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          status: 400,
          message: "Bad request. Missing parameters",
        });
      } else {
        let data = await db.User.findOne({
          where: { id },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["contentMarkdown", "contentHTML", "description"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },

            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId", "updatedAt", "createdAt"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (data && data.image) {
          data.image = Buffer.from(data.image, "base64").toString("binary");
        }

        resolve({
          status: 200,
          data: data ? data : {},
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let bulkScheduleService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sheduleData = [];
      if (!data || !data[0].doctorId || !data[0].date) {
        resolve({
          status: 400,
          message: "Bad request. Missing a parameters",
        });
      } else {
        if (data.length > 0) {
          sheduleData = data.map((item) => ({
            ...item,
            maxNumber: MAX_NUMBER_SCHEDULE,
          }));
        }
        //get all existing schedules

        let existing = await db.Schedule.findAll({
          where: { doctorId: data[0].doctorId, date: data[0].date },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
        });

        //compare different
        let toCreate = _.differenceWith(
          sheduleData,
          existing,
          (a, b) => a.timeType === b.timeType && a.date === b.date
        );
        //create data
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }
        resolve({
          status: 200,
          message: "Save schedule success",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getScheduleDoctorByDateService = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          status: 400,
          message: "Bad request. Missing a parameters",
        });
      } else {
        let result = await db.Schedule.findAll({
          where: { doctorId, date },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });

        resolve({
          status: 200,
          data: result || [],
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getExtraInfoDoctorByIdService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          status: 400,
          message: "Bad request. Missing parameters",
        });
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: { doctorId: id },
          attributes: {
            exclude: ["id", "doctorId", "updatedAt", "createdAt"],
          },
          include: [
            {
              model: db.Allcode,
              as: "priceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "paymentTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "provinceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });

        resolve({
          status: 200,
          data: data ? data : {},
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getTopDoctor,
  getAllDoctor,
  saveInfoDoctor,
  getDetailDoctorById,
  bulkScheduleService,
  getScheduleDoctorByDateService,
  getExtraInfoDoctorByIdService,
};
