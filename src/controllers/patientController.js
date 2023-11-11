import patientService from "../services/patientService";

let patientBookAppointment = async (req, res) => {
  try {
    let result = await patientService.patientBookAppointmentService(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Can't connect to server",
    });
  }
};

let verifyBookingAppointment = async (req, res) => {
  try {
    let result = await patientService.verifyBookingAppointmentService(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Can't connect to server",
    });
  }
};

module.exports = {
  patientBookAppointment,
  verifyBookingAppointment,
};
