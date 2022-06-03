const CustomErrorAPI = require("./custom-error");
const BadRequest = require("./bad-request");
const UnauthenticatedError = require("./unauthenticated");
const NotFoundError = require("./not-found");

module.exports = {
  CustomErrorAPI,
  BadRequest,
  UnauthenticatedError,
  NotFoundError,
};
