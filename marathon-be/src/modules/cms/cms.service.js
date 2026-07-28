import { Page, Announcement } from "./cms.model.js";

export const cmsService = {
  async listPages(query = {}) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.all === "true") filter;
    const pages = await Page.find(filter).sort({ order: 1, createdAt: -1 });
    return { pages, total: pages.length };
  },

  async getPage(id) {
    const page = await Page.findById(id);
    if (!page) throw new Error("Page not found");
    return { page };
  },

  async getPageBySlug(slug) {
    const page = await Page.findOne({ slug });
    if (!page) throw new Error("Page not found");
    return { page };
  },

  async createPage(data) {
    const page = await Page.create(data);
    return { page };
  },

  async updatePage(id, data) {
    const page = await Page.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!page) throw new Error("Page not found");
    return { page };
  },

  async deletePage(id) {
    const page = await Page.findByIdAndDelete(id);
    if (!page) throw new Error("Page not found");
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
    if (!announcement) throw new Error("Announcement not found");
    return { announcement };
  },

  async deleteAnnouncement(id) {
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) throw new Error("Announcement not found");
  },
};
