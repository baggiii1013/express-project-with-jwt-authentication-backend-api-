const express = require("express");
const router = express.Router();
const {
  getContact,
  createContact,
  getOneContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken)
router.route("/").get(getContact).post(createContact);
router.route("/:id").get(getOneContact).put(updateContact).delete(deleteContact);
module.exports = router;
