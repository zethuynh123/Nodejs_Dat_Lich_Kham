require("dotenv").config;
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Duy Huynh 👻" <zethuynh456@gmail.com>', // sender address
    to: data.email, // list of receivers
    subject: `${
      data.language === "vi"
        ? "Thông tin đặt lịch khám bệnh"
        : "Information for scheduling medical examination"
    }`, // Subject line
    // text: "Hello world?", // plain text body
    html: handleChangeLanguageEmail(data),
  });
};

let sendAttachment = async (data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Duy Huynh 👻" <zethuynh456@gmail.com>', // sender address
    to: data.email, // list of receivers
    subject: `${
      data.language === "vi"
        ? "Kết quả đặt lịch khám bệnh"
        : "Information for scheduling medical examination"
    }`, // Subject line
    // text: "Hello world?", // plain text body
    html: getBodyHTMLEmailRemedy(data),
    attachments: [
      {
        filename: `remedy-${data.patientId}-${new Date().getTime()}.jpg`,
        content: data.imageBase64.split("base64,")[1],
        encoding: "base64",
      },
    ],
  });
};

const handleChangeLanguageEmail = (data) => {
  if (data.language === "vi") {
    return `
        <h3>Xin chào ${data.patientName}!</h3>
        <p>Đây là email xác nhận lịch khám bệnh trên BookingCare</p>
        <p>Thông tin lịch khám bệnh:</p>
        <div>Thời gian: <b>${data.time}</b></div>
        <div>Bác sĩ: <b>${data.doctorName}</b></div>
        <p>Vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
        <div>
        <a href=${data.redireactLink} target="_blank">Click vào đây</a>
        </div>
        <div>
        Xin cảm ơn.
        </div>
        `;
  }
  if (data.language === "en") {
    return `
        <h3>Dear ${data.patientName}!</h3>
        <p>This is the email confirming the medical appointment on BookingCare</p>
        <p>Medical examination schedule information:</p>
        <div>Time: <b style={{textTransform:'capitalize'}}>${data.time}</b></div>
        <div>Doctor's name: <b>${data.doctorName}</b></div>
        <p>Please click on the link below to confirm and complete the medical appointment booking procedure</p>
        <div>
        <a href=${data.redireactLink} target="_blank">Click here</a>
        </div>
        <div>
        Sincerely thank.
        </div>
        `;
  }
  return;
};

const getBodyHTMLEmailRemedy = (data) => {
  if (data.language === "vi") {
    return `
    <h3>Xin chào ${data.patientName}!</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên BookingCare thành công.</p>
    <p>Thông tin hóa đơn/ đơn thuốc được gửi trong tệp đính kèm.</p>
    <div>
    Xin cảm ơn.
    </div>
        `;
  }
  if (data.language === "en") {
    return `
        <h3>Dear ${data.patientName}!</h3>
        <p>You received this email because you have successfully booked a medical appointment on BookingCare.</p>
        <p>Invoice/prescription information is sent in the attached file.</p>
        <div>
        Sincerely thank.
        </div>
        `;
  }
  return;
};

module.exports = {
  sendSimpleEmail,
  sendAttachment,
};
