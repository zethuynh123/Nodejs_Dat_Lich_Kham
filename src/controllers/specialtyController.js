import specialtyService from "../services/specialtyService";

let createNewSpecialty = async (req, res) => {
  try {
    let result = await specialtyService.createNewSpecialtyService(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Can't connect to server",
    });
  }
};

let getAllSpecialty = async (req, res) => {
  try {
    let result = await specialtyService.getAllSpecialtyService();
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Can't connect to server",
    });
  }
};

let getDetailSpecialtyById = async (req, res) => {
  try {
    let result = await specialtyService.getDetailSpecialtyByIdService(
      req.query.id,
      req.query.location
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Can't connect to server",
    });
  }
};

module.exports = {
  createNewSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
};
