export type Message = {
  id: string
  senderId: string
  senderDisplayName: string
  senderImageIrl: string
  recipientId: string
  recipientDisplayName: string
  recipientImageIrl: string
  content: string
  dateRead?: string
  messageSent: string
  currentUserSender?:boolean;
}