const express = require("express");
const {
  homeIndex,
  loginIndex,
  loginAction,
  idIndex,
  logoutAction,
  registerIndex,
  registerAction,
  profileIndex,
  editProfileIndex,
  editProfileAction,
  deleteProfileAction,
} = require("./controllers");
const router = express.Router();

router.get("/", homeIndex); 

// Authentication
router.get("/login", loginIndex);
router.post("/login", loginAction);

router.post("/logout", logoutAction);

router.get("/register", registerIndex);
router.post("/register", registerAction);

router.get("/profile", profileIndex);
router.get("/profile/edit", editProfileIndex);
router.post("/profile/edit", editProfileAction);

// router.post("/profile/delete", deleteProfileAction);

router.get("/:id", idIndex);

module.exports = router;