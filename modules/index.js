const router = require("express").Router();

router.use("/users", require("./users/index"))

module.exports = router;