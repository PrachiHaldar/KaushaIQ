const { getStudentPassportData, verifyPassportByCode } = require('../services/passportService.service');
const prisma = require('../config/db');

// Get logged-in student's Digital Skill Passport
const getMyPassport = async (req, res, next) => {
  try {
    if (!req.user.studentProfile) {
      return res.status(403).json({ success: false, message: 'Only students have personal skill passports.' });
    }

    const passportData = await getStudentPassportData(req.user.studentProfile.id);
    res.json({ success: true, data: passportData });
  } catch (error) {
    next(error);
  }
};

// Public QR Code Verification endpoint
const verifyPublicPassport = async (req, res, next) => {
  try {
    const { code } = req.params;
    const verification = await verifyPassportByCode(code);

    if (!verification.isValid) {
      return res.status(404).json({ success: false, message: verification.message });
    }

    res.json({ success: true, data: verification });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyPassport,
  verifyPublicPassport
};
