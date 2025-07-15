import mockCommunications from "@/services/mockData/communications.json";

let communications = [...mockCommunications];
let nextId = Math.max(...communications.map(c => c.Id), 0) + 1;

class CommunicationService {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...communications];
  }

  async getById(id) {
    const communicationId = parseInt(id);
    if (isNaN(communicationId)) {
      throw new Error("Invalid communication ID");
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const communication = communications.find(c => c.Id === communicationId);
    return communication ? { ...communication } : null;
  }

  async getByStudentId(studentId) {
    const id = parseInt(studentId);
    if (isNaN(id)) {
      throw new Error("Invalid student ID");
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const studentCommunications = communications
      .filter(c => c.studentId === id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return studentCommunications.map(c => ({ ...c }));
  }

  async create(communicationData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const newCommunication = {
      Id: nextId++,
      studentId: parseInt(communicationData.studentId),
      type: communicationData.type || "message",
      subject: communicationData.subject || "",
      notes: communicationData.notes || "",
      date: communicationData.date || new Date().toISOString()
    };

    communications.push(newCommunication);
    return { ...newCommunication };
  }

  async update(id, communicationData) {
    const communicationId = parseInt(id);
    if (isNaN(communicationId)) {
      throw new Error("Invalid communication ID");
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const index = communications.findIndex(c => c.Id === communicationId);
    if (index === -1) {
      throw new Error("Communication not found");
    }

    const updatedCommunication = {
      ...communications[index],
      type: communicationData.type || communications[index].type,
      subject: communicationData.subject || communications[index].subject,
      notes: communicationData.notes || communications[index].notes,
      date: communicationData.date || communications[index].date
    };

    communications[index] = updatedCommunication;
    return { ...updatedCommunication };
  }

  async delete(id) {
    const communicationId = parseInt(id);
    if (isNaN(communicationId)) {
      throw new Error("Invalid communication ID");
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = communications.findIndex(c => c.Id === communicationId);
    if (index === -1) {
      throw new Error("Communication not found");
    }

    communications.splice(index, 1);
    return true;
  }
}

export const communicationService = new CommunicationService();