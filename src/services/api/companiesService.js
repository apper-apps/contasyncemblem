import companiesData from "@/services/mockData/companies.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const companiesService = {
  async getAll() {
    await delay(300);
    return [...companiesData];
  },

  async getById(id) {
    await delay(200);
    const company = companiesData.find(c => c.Id === id);
    if (!company) {
      throw new Error("Company not found");
    }
    return { ...company };
  },

  async create(companyData) {
    await delay(400);
    const maxId = Math.max(...companiesData.map(c => c.Id), 0);
    const newCompany = {
      ...companyData,
      Id: maxId + 1
    };
    companiesData.push(newCompany);
    return { ...newCompany };
  },

  async update(id, companyData) {
    await delay(300);
    const index = companiesData.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Company not found");
    }
    companiesData[index] = { ...companiesData[index], ...companyData };
    return { ...companiesData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = companiesData.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Company not found");
    }
    const deleted = companiesData.splice(index, 1)[0];
    return { ...deleted };
  }
};