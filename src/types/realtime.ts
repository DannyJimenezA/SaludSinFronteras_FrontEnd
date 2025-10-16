/**
 * types/realtime.ts
 * Tipos para transcripción y traducción en tiempo real (captions).
 */

import type { ISODate } from "./common";

export type LangCode = string; // ej.: 'es', 'en', 'pt-BR'

export interface CaptionChunk {
  id: string;
  ts: ISODate;           // timestamp del servidor
  seq: number;           // orden incremental
  text: string;          // contenido
  lang: LangCode;        // idioma del texto
  translated?: boolean;  // si es traducción (vs texto original)
  fromLang?: LangCode;   // idioma original si es traducido
  speaker?: "DOCTOR" | "PATIENT" | "SYSTEM";
}

export interface TranslationPrefs {
  enabled: boolean;
  sourceLang?: LangCode;     // idioma a detectar o fijo (si se configura)
  targetLangs?: LangCode[];  // a qué idiomas traducir (UI puede elegir uno)
}
