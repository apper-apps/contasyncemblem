import messagesData from "@/services/mockData/messages.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const messagesService = {
  async getAll() {
    await delay(300);
    return [...messagesData];
  },

  async getById(id) {
    await delay(200);
    const message = messagesData.find(m => m.Id === id);
    if (!message) {
      throw new Error("Message not found");
    }
    return { ...message };
  },

  async create(messageData) {
    await delay(400);
    const maxId = Math.max(...messagesData.map(m => m.Id), 0);
    const newMessage = {
      ...messageData,
      Id: maxId + 1
    };
    messagesData.push(newMessage);
    return { ...newMessage };
  },

  async update(id, messageData) {
    await delay(300);
    const index = messagesData.findIndex(m => m.Id === id);
    if (index === -1) {
      throw new Error("Message not found");
    }
    messagesData[index] = { ...messagesData[index], ...messageData };
    return { ...messagesData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = messagesData.findIndex(m => m.Id === id);
    if (index === -1) {
      throw new Error("Message not found");
    }
    const deleted = messagesData.splice(index, 1)[0];
    return { ...deleted };
  },

  async getByCompanyId(companyId) {
    await delay(250);
    return messagesData.filter(m => m.companyId === companyId.toString());
  }
};