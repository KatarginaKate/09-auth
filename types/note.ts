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
  authorId?: string;
  authorEmail?: string;
  user?: {
    _id?: string;
    id?: string;
    email?: string;
  };
  owner?: {
    _id?: string;
    id?: string;
    email?: string;
  };
  author?: {
    _id?: string;
    id?: string;
    email?: string;
  };
}

