import db from "../models/index";
import CRUDservice from "../services/CRUDservice";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homepage.ejs", { data: JSON.stringify(data) });
  } catch (error) {
    console.log(error);
  }
};

let getAboutPage = (req, res) => {
  return res.render("test/about.ejs");
};

let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  let result = CRUDservice.createNewUser(req.body)
    .then(() => res.redirect("/get-crud"))
    .catch((e) => res.send(e));
};

let displayCRUD = async (req, res) => {
  let data = await CRUDservice.getAllUser();
  return res.render("displayCRUD.ejs", { data });
};

let editCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userQuery = db.User.findOne({ where: { id: userId }, raw: true })
      .then((result) => {
        res.render("editCRUD.ejs", { data: result });
      })
      .catch((e) => res.send("User not found!"));
  } else {
    res.send("User is invalid");
  }
};

let putCRUD = async (req, res) => {
  let userId = req.query.id;
  let data = req.body;
  return new Promise(async (resolve, reject) => {
    if (userId) {
      try {
        await db.User.update(
          {
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            gender: data.gender === "1" ? true : false,
          },
          {
            where: {
              id: userId,
            },
          }
        );
        res.redirect("/get-crud");
        resolve("update done!");
      } catch (error) {
        reject(error);
      }
    } else {
      res.send("User not found");
    }
  });
};

let deleteCRUD = async (req, res) => {
  let userId = req.query.id;
  return new Promise(async (resolve, reject) => {
    if (userId) {
      try {
        await db.User.destroy({
          where: {
            id: userId,
          },
        });
        res.redirect("/get-crud");
        resolve("delete done!");
      } catch (error) {
        reject(error);
      }
    } else {
      res.send("User not found");
    }
  });
};

module.exports = {
  getHomePage,
  getAboutPage,
  getCRUD,
  postCRUD,
  displayCRUD,
  editCRUD,
  putCRUD,
  deleteCRUD,
};
