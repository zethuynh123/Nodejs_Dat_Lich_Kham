import db from "../models/index";
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

module.exports = {
  getTopDoctorHome,
};
