const router = require("express").Router();

const { getUser, makeAttendance, getAllAttendanceDayWise, getSingleDayList, makeAbsent } = require("./services");

router.get("/get-users", getUser)
router.post("/make-attendance", makeAttendance)
router.post("/get-attendance-list", getAllAttendanceDayWise)
router.post("/single-day", getSingleDayList)
router.post("/make-absent", makeAbsent)

module.exports = router;