import { CreateNoteDto } from '../dto/create-note.dto';
import { NoteEntity } from '../entity/note.entity';

export interface INoteServie {
  createNote(dto: CreateNoteDto): Promise<NoteEntity>;
  getAllNotes(): Promise<NoteEntity[]>;
  getNoteById(id: string): Promise<NoteEntity>;
  updateNote(id: string, dto: CreateNoteDto): Promise<NoteEntity>;
  deleteNote(id: string): Promise<void>;
}
