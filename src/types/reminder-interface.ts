export interface IReminder {
  _id?: string;
  reminderText: string;
  reminderDate: string;
  relatedTaskId?: string;
  isDone: boolean;
  createdAt?: string;
  createdBy?: string;
  completedAt?: string;
}
