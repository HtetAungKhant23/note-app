export class NoteEntity {
  id: string;

  text: string;

  createdAt: Date;

  isDeleted: boolean;

  constructor(id: string, text: string, createdAt: Date, isDeleted: boolean) {
    this.id = id;
    this.text = text;
    this.createdAt = createdAt;
    this.isDeleted = isDeleted;
  }
}
