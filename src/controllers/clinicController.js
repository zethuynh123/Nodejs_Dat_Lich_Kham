import clinicService from "../services/clinicService";

let createNewClinic = async (req, res) => {
  try {
    let result = await clinicService.createNewClinicService(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Can't connect to server",
    });
  }
};

let getAllClinic = async (req, res) => {
  try {
    let result = await clinicService.getAllClinicService();
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Can't connect to server",
    });
  }
};

let getDetailClinicById = async (req, res) => {
  try {
    let result = await clinicService.getDetailClinicByIdService(req.query.id);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Can't connect to server",
    });
  }
};

module.exports = {
  createNewClinic,
  getAllClinic,
  getDetailClinicById,
};
