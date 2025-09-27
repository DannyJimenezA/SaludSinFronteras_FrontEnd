/**
 * Messaging & translations — dbo.Conversations, dbo.ConversationParticipants, dbo.Messages, dbo.MessageTranslations
 */
import type { Id, ISODate, LanguageCode } from "./common";

export interface Conversation {
  id: Id;                 // Conversations.Id
  appointmentId?: Id;     // Conversations.AppointmentId (nullable)
  createdBy: Id;          // Conversations.CreatedBy
  createdAt: ISODate;     // Conversations.CreatedAt
  participants?: ConversationParticipant[];
}

export interface ConversationParticipant {
  conversationId: Id;     // ConversationParticipants.ConversationId
  userId: Id;             // ConversationParticipants.UserId
}

export type MessageType = "TEXT" | "IMAGE" | "FILE" | "SYSTEM"; // Messages.Type (nvarchar 40)
export interface Message {
  id: Id;                 // Messages.Id
  conversationId: Id;     // Messages.ConversationalId (assumed ConversationId)
  senderUserId: Id;       // Messages.SenderUserId
  type: string;           // Messages.Type
  content?: string;       // Messages.Content (nullable)
  language?: string;      // Messages.Language (nullable)
  createdAt: ISODate;     // Messages.CreatedAt
  filed: boolean;         // Messages.Filed (bit)
  translations?: MessageTranslation[];
}

export interface MessageTranslation {
  id: Id;                 // MessageTranslations.Id
  messageId: Id;          // MessageTranslations.MessageId
  language: string;       // nvarchar 20
  content: string;        // nvarchar(max)
  engine?: string;        // nvarchar 120
  confidence?: number;    // decimal
  createdAt: ISODate;     // datetime2
}
