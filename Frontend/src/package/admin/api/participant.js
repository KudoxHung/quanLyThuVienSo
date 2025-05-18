import axiosClient from "./axiosClient";

export const Participant = {
  InsertCategory: async (data) => {
    return await axiosClient.post("/Participant/InsertCategory", data);
  },
  GetlistParticipantsByIdReceipt: async (id) => {
    return await axiosClient.get(
      `/Participant/GetlistParticipantsBy?IdReceipt=${id}`,
    );
  },
  GetlistNameParticipants: async (pageSize, pageNumber) => {
    return await axiosClient.get(
      `/Participant/GetlistNameParticipants?pageSize=${pageSize}&pageNumber=${pageNumber}`,
    );
  },
  GetlistMissionParticipants: async (pageSize, pageNumber) => {
    return await axiosClient.get(
      `/Participant/GetlistMissionParticipants?pageSize=${pageSize}&pageNumber=${pageNumber}`,
    );
  },
  GetlistPositionParticipants: async (pageSize, pageNumber) => {
    return await axiosClient.get(
      `/Participant/GetlistPositionParticipants?pageSize=${pageSize}&pageNumber=${pageNumber}`,
    );
  },
};
