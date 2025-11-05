/**
 * Types for Video Conferencing (LiveKit integration)
 */

export interface VideoRoom {
  AppointmentId: string;
  SfuRoomId: string;
  message: string;
}

export interface VideoToken {
  token: string;
  url: string;
  roomName: string;
}

export interface CreateVideoRoomResponse {
  AppointmentId: string;
  SfuRoomId: string;
  message: string;
}

export interface EndVideoRoomResponse {
  message: string;
}
