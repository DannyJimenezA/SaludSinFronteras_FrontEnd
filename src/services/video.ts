/**
 * Video Conferencing Service
 * Handles LiveKit integration for video calls in appointments
 *
 * Flow:
 * 1. Create/ensure video room for an appointment
 * 2. Get token to join the room
 * 3. Use token with LiveKit client components
 * 4. Optionally end the room when consultation is done
 */

import { api } from "../lib/api";
import type {
  CreateVideoRoomResponse,
  VideoToken,
  EndVideoRoomResponse,
} from "../types/video";

/** ===== CONSTANTS ===== */
const VIDEO_ROOM_PATH = (appointmentId: string) => `/appointments/${appointmentId}/video`;
const VIDEO_TOKEN_PATH = (appointmentId: string) => `/appointments/${appointmentId}/video/token`;

/** ===== CREATE OR ENSURE VIDEO ROOM ===== */
export async function ensureVideoRoom(
  appointmentId: string
): Promise<CreateVideoRoomResponse> {
  if (import.meta.env.DEV) {
    console.debug("[VIDEO] ensureVideoRoom →", { appointmentId });
  }

  try {
    const { data } = await api.post<CreateVideoRoomResponse>(
      VIDEO_ROOM_PATH(appointmentId)
    );
    return data;
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 403) {
      throw new Error("No tienes permisos para crear una sala de video para esta cita");
    }

    if (status === 404) {
      throw new Error("Cita no encontrada");
    }

    if (status === 400) {
      const msg = err?.response?.data?.message;
      throw new Error(msg || "No se puede crear sala de video para esta cita");
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudo crear la sala de video";

    throw new Error(String(msg));
  }
}

/** ===== GET VIDEO TOKEN ===== */
export async function getVideoToken(appointmentId: string): Promise<VideoToken> {
  if (import.meta.env.DEV) {
    console.debug("[VIDEO] getVideoToken →", { appointmentId });
  }

  try {
    const { data } = await api.get<VideoToken>(VIDEO_TOKEN_PATH(appointmentId));
    return data;
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 403) {
      throw new Error("No tienes permisos para unirte a esta videollamada");
    }

    if (status === 404) {
      throw new Error(
        "Sala de video no encontrada. Asegúrate de que la sala haya sido creada primero."
      );
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudo obtener el token de video";

    throw new Error(String(msg));
  }
}

/** ===== END VIDEO ROOM (Optional) ===== */
export async function endVideoRoom(appointmentId: string): Promise<EndVideoRoomResponse> {
  if (import.meta.env.DEV) {
    console.debug("[VIDEO] endVideoRoom →", { appointmentId });
  }

  try {
    const { data } = await api.delete<EndVideoRoomResponse>(VIDEO_ROOM_PATH(appointmentId));
    return data;
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 403) {
      throw new Error("Solo el doctor o admin pueden terminar la sala de video");
    }

    if (status === 404) {
      throw new Error("Sala de video no encontrada");
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudo terminar la sala de video";

    throw new Error(String(msg));
  }
}

/** ===== SETUP VIDEO CALL (Helper) ===== */
/**
 * Helper function to setup a video call:
 * 1. Ensures the room exists
 * 2. Gets the access token
 * Returns all necessary data to join the call
 */
export async function setupVideoCall(appointmentId: string): Promise<{
  room: CreateVideoRoomResponse;
  token: VideoToken;
}> {
  if (import.meta.env.DEV) {
    console.debug("[VIDEO] setupVideoCall →", { appointmentId });
  }

  try {
    // First ensure the room exists
    const room = await ensureVideoRoom(appointmentId);

    // Then get the token
    const token = await getVideoToken(appointmentId);

    return { room, token };
  } catch (err: any) {
    throw new Error(
      err?.message ?? "No se pudo configurar la videollamada"
    );
  }
}
