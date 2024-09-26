import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/shared/prisma/prisma.service';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { INoteServie } from './interfaces/note-service.interface';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteEntity } from './entity/note.entity';

@Injectable()
export class NoteService implements INoteServie {
  constructor(private readonly dbService: PrismaService) {}

  async createNote(dto: CreateNoteDto): Promise<NoteEntity> {
    const newNote = await this.dbService.note.create({
      data: {
        text: dto.text,
      },
    });
    return new NoteEntity(newNote.id, newNote.text, newNote.createdAt, newNote.isDeleted);
  }

  async getAllNotes(): Promise<NoteEntity[]> {
    const notes = await this.dbService.note.findMany({
      where: {
        isDeleted: false,
      },
    });
    return notes.map((note) => {
      return new NoteEntity(note.id, note.text, note.updatedAt, note.isDeleted);
    });
  }

  async getNoteById(id: string): Promise<NoteEntity> {
    const note = await this.dbService.note.findUnique({
      where: {
        id,
        isDeleted: false,
      },
    });
    if (!note) {
      throw new BadRequestException({
        message: `Note not found.`,
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
      });
    }
    return new NoteEntity(note?.id || '', note?.text || '', note?.updatedAt || new Date(), note?.isDeleted || false);
  }

  async updateNote(id: string, dto: CreateNoteDto): Promise<NoteEntity> {
    const note = await this.dbService.note.findUnique({
      where: {
        id,
        isDeleted: false,
      },
    });
    if (!note) {
      throw new BadRequestException({
        message: `Note not found.`,
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
      });
    }
    const updNote = await this.dbService.note.update({
      where: {
        id: note.id,
      },
      data: {
        text: dto.text,
      },
    });
    return new NoteEntity(updNote.id, updNote.text, updNote.updatedAt, updNote.isDeleted);
  }

  async deleteNote(id: string): Promise<void> {
    const note = await this.dbService.note.findUnique({
      where: {
        id,
        isDeleted: false,
      },
    });
    if (!note) {
      throw new BadRequestException({
        message: `Note not found.`,
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
      });
    }
    await this.dbService.note.update({
      where: {
        id: note.id,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}
