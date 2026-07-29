import { Page, Announcement } from "./cms.model.js";
import { AppError } from "../../utils/AppError.js";

export const cmsService = {
  async listPages(query = {}) {
    const filter = {};
    if (query.status) {
      filter.status = query.status;
    } else if (query.all !== "true") {
      filter.status = "published";
    }
    const pages = await Page.find(filter).sort({ order: 1, createdAt: -1 });
    return { pages, total: pages.length };
  },

  async getPage(id) {
    const page = await Page.findById(id);
    if (!page) throw new AppError("Page not found", 404);
    return { page };
  },

  async getPageBySlug(slug) {
    const page = await Page.findOne({ slug });
    if (!page) throw new AppError("Page not found", 404);
    return { page };
  },

  async createPage(data) {
    const page = await Page.create(data);
    return { page };
  },

  async updatePage(id, data) {
    const page = await Page.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!page) throw new AppError("Page not found", 404);
    return { page };
  },

  async deletePage(id) {
    const page = await Page.findByIdAndDelete(id);
    if (!page) throw new AppError("Page not found", 404);
  },

  async listAnnouncements() {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    return { announcements };
  },

  async createAnnouncement(data) {
    const announcement = await Announcement.create(data);
    return { announcement };
  },

  async updateAnnouncement(id, data) {
    const announcement = await Announcement.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!announcement) throw new AppError("Announcement not found", 404);
    return { announcement };
  },

  async deleteAnnouncement(id) {
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) throw new AppError("Announcement not found", 404);
  },
};
