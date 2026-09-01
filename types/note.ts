export type NoteTag =
  | 'Todo'
  | 'Work'
  | 'Personal'
  | 'Meeting'
  | 'Shopping';

export interface Note {
  id: string;
  _id?: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  userEmail?: string;
  ownerId?: string;
  ownerEmail?: string;
  authorEmail?: string;
  user?: {
    email?: string;
  };
  owner?: {
    email?: string;
  };
  author?: {
    email?: string;
  };
}

