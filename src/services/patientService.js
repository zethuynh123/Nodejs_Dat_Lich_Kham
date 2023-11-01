import db from "../models/index";
import bcrypt from "bcryptjs";
import _ from "lodash";
require("dotenv").config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

const salt = bcrypt.genSaltSync(10);

let patientBookAppointmentService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sheduleData = [];
      if (!data.email || !data.doctorId || !data.timeType || !data.date) {
        resolve({
          status: 400,
          message: "Bad request. Missing a parameters",
        });
      } else {
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
          },
        });

        if (user?.[0]) {
          await db.Booking.findOrCreate({
            where: {
              patientId: user[0].id,
            },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
            },
          });
        }
        resolve({
          status: 200,
          message: "Save info patient success",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  patientBookAppointmentService,
};
