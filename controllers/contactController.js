const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc Get all contacts
//@route GET/api/contacts
//@access private
const getContact = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const contacts = await Contact.find({ user_id: userId });
  // res.status(200).json({ message: "get all the contacts using this" });
  res.status(200).json(contacts);
});

//@desc Get one contacts
//@route GET/api/contacts/id
//@access private
const getOneContact = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("contact not found");
  }
  if(contact.user_id.toString() !== userId){
    res.status(403);
    throw new Error("User not authorized")
  }
  res.status(200).json(contact);
  // res.status(200).json({ message: `update contact for ${req.params.id}` });;
});

//@desc create new contacts
//@route POST/api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
  console.log("This is the request body:", req.body);
  const userId = req.user.id;
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All the fields are mandatory");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id : userId,
  });
  res.status(201).json(contact);
});

//@desc update contacts
//@route PUT/api/contacts/id
//@access private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("contact not found");
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
  res.status(200).json({ message: `update contact for ${req.params.id}` });
});

//@desc delete contacts
//@route DELETE/api/contacts/id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

module.exports = {
  getContact,
  createContact,
  getOneContact,
  updateContact,
  deleteContact,
};
