import db from "../models/index";
import bcrypt from "bcryptjs";
import _ from "lodash";
import emailService from "../services/emailService";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();

let buildUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};

let patientBookAppointmentService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullName ||
        !data.timeString ||
        !data.doctorName ||
        !data.phoneNumber ||
        !data.selectedGender ||
        !data.address ||
        !data.language
      ) {
        resolve({
          status: 400,
          message: "Bad request. Missing a parameters",
        });
      } else {
        let token = uuidv4();
        await emailService.sendSimpleEmail({
          email: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redireactLink: buildUrlEmail(data.doctorId, token),
        });

        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
            gender: data.selectedGender,
            address: data.address,
            firstName: data.fullName,
            phoneNumber: data.phoneNumber,
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
              token,
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

let verifyBookingAppointmentService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          status: 400,
          message: "Bad request. Missing a parameters",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();

          resolve({
            status: 200,
            message: "Update the appointment success",
          });
        } else {
          resolve({
            status: 400,
            message: "Appointment has been activated or does not exist",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  patientBookAppointmentService,
  verifyBookingAppointmentService,
};
