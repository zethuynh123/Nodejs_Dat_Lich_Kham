import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) {
    limit = 10;
  }
  try {
    let doctors = await doctorService.getTopDoctor(Number(limit));
    return res.status(doctors.status).json(doctors);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};

let getAllDoctor = async (req, res) => {
  try {
    let doctor = await doctorService.getAllDoctor(req.query.type);
    return res.status(doctor.status).json(doctor);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Can't connect to server",
    });
  }
};

let saveInfoDoctor = async (req, res) => {
  try {
    let result = await doctorService.saveInfoDoctor(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Can't connect to server",
    });
  }
};

let getDetailDoctorById = async (req, res) => {
  try {
    let result = await doctorService.getDetailDoctorById(req.query.id);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Can't connect to server",
    });
  }
};

let bulkSchedule = async (req, res) => {
  try {
    let result = await doctorService.bulkScheduleService(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Can't connect to server",
    });
  }
};

let getScheduleDoctorByDate = async (req, res) => {
  try {
    let result = await doctorService.getScheduleDoctorByDateService(
      req.query.doctorId,
      req.query.date
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Can't connect to server",
    });
  }
};

let getExtraInfoDoctorById = async (req, res) => {
  try {
    let result = await doctorService.getExtraInfoDoctorByIdService(
      req.query.doctorId
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Can't connect to server",
    });
  }
};

let getListPatientForDoctor = async (req, res) => {
  try {
    let result = await doctorService.getListPatientForDoctorService(
      req.query.id,
      req.query.date
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Can't connect to server",
    });
  }
};

let sendRemedy = async (req, res) => {
  try {
    let result = await doctorService.sendRemedyService(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Can't connect to server",
    });
  }
};

module.exports = {
  getTopDoctorHome,
  getAllDoctor,
  saveInfoDoctor,
  getDetailDoctorById,
  bulkSchedule,
  getScheduleDoctorByDate,
  getExtraInfoDoctorById,
  getListPatientForDoctor,
  sendRemedy,
};
