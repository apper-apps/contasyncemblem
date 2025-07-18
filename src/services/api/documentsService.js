import documentsData from "@/services/mockData/documents.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const documentsService = {
  async getAll() {
    await delay(350);
    return [...documentsData];
  },

  async getById(id) {
    await delay(200);
    const document = documentsData.find(d => d.Id === id);
    if (!document) {
      throw new Error("Document not found");
    }
    return { ...document };
  },

  async create(documentData) {
    await delay(500);
    const maxId = Math.max(...documentsData.map(d => d.Id), 0);
    const newDocument = {
      ...documentData,
      Id: maxId + 1
    };
    documentsData.push(newDocument);
    return { ...newDocument };
  },

  async update(id, documentData) {
    await delay(300);
    const index = documentsData.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Document not found");
    }
    documentsData[index] = { ...documentsData[index], ...documentData };
    return { ...documentsData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = documentsData.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Document not found");
    }
    const deleted = documentsData.splice(index, 1)[0];
    return { ...deleted };
  },

  async getByCompanyId(companyId) {
    await delay(250);
    return documentsData.filter(d => d.companyId === companyId.toString());
  }
};