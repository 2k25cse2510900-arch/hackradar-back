const Bookmark = require("../models/Bookmark");
const ApiError = require("../utils/ApiError");
const hackathonService = require("./hackathon.service");

async function listBookmarks(userId) {
  const bookmarks = await Bookmark.find({ user: userId })
    .lean()
    .sort({ createdAt: -1 });

  const hackathons = hackathonService.listHackathons({
    page: 1,
    limit: 1000,
  }).hackathons;

  const hackathonMap = new Map();

  hackathons.forEach((hackathon) => {
    hackathonMap.set(hackathon.id, hackathon);
  });

  return bookmarks.map((bookmark) => ({
    ...bookmark,
    hackathon: hackathonMap.get(bookmark.hackathonId) || null,
  }));
}

async function saveBookmark(userId, hackathonId) {
  hackathonService.getHackathonById(hackathonId);

  const existing = await Bookmark.findOne({
    user: userId,
    hackathonId,
  });

  if (existing) {
    throw new ApiError(409, "Hackathon already bookmarked");
  }

  return Bookmark.create({
    user: userId,
    hackathonId,
  });
}

async function removeBookmark(userId, bookmarkId) {
  const bookmark = await Bookmark.findOneAndDelete({
    _id: bookmarkId,
    user: userId,
  });

  if (!bookmark) {
    throw new ApiError(404, "Bookmark not found");
  }

  return bookmark;
}

module.exports = {
  listBookmarks,
  saveBookmark,
  removeBookmark,
};