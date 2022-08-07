export type MessageContent = string | object;

export type Message = {
  content: MessageContent;
  id: string;
  sentAt: Date;
};
