const hackathonService = require("../services/hackathon.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const listHackathons = asyncHandler(async (req, res) => {
  const result = hackathonService.listHackathons(req.query);

  res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Hackathons fetched successfully"
    )
  );
});

const getHackathon = asyncHandler(async (req, res) => {
  const hackathon = hackathonService.getHackathonById(req.params.id);
  res.status(200).json(new ApiResponse(200, { hackathon }, "Hackathon fetched"));
});

module.exports = {
  listHackathons,
  getHackathon,
};
