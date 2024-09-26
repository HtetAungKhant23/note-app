import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Inject, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { CreateNoteDto } from './dto/create-note.dto';
import { INoteServie } from './interfaces/note-service.interface';
import { NoteService } from './note.service';

@ApiTags('Note')
@Controller({
  version: '1',
})
export class NoteController {
  constructor(@Inject(NoteService) private noteService: INoteServie) {}

  @Post()
  @ApiBody({ type: CreateNoteDto, description: 'Create Note.' })
  async createNote(@Body() dto: CreateNoteDto) {
    try {
      const note = await this.noteService.createNote(dto);
      return {
        _data: note,
        _metadata: {
          message: 'Note created successfully.',
          statusCode: HttpStatus.CREATED,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to create guest.',
      });
    }
  }

  @Get()
  @ApiOperation({ description: 'Get All Notes.' })
  async getAllNotes() {
    try {
      const notes = await this.noteService.getAllNotes();
      return {
        _data: notes,
        _metadata: {
          message: 'All note fetched successfully.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to fetch all notes.',
      });
    }
  }

  @Get(':id')
  @ApiParam({ type: String, name: 'id', description: 'Get Note By Id.' })
  async getNoteById(@Param('id') id: string) {
    try {
      const notes = await this.noteService.getNoteById(id);
      return {
        _data: notes,
        _metadata: {
          message: 'Note fetched successfully.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to fetch note.',
      });
    }
  }

  @Patch(':id')
  @ApiParam({ type: String, name: 'id' })
  @ApiBody({ type: CreateNoteDto, description: 'Update Note.' })
  async updateNote(@Param('id') id: string, @Body() dto: CreateNoteDto) {
    try {
      const notes = await this.noteService.updateNote(id, dto);
      return {
        _data: notes,
        _metadata: {
          message: 'Note updated successfully.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to update note.',
      });
    }
  }

  @Delete(':id')
  @ApiParam({ type: String, name: 'id', description: 'Delete Note.' })
  async deleteNote(@Param('id') id: string) {
    try {
      await this.noteService.deleteNote(id);
      return {
        _data: null,
        _metadata: {
          message: 'Note deleted successfully.',
          statusCode: HttpStatus.NO_CONTENT,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to delete note.',
      });
    }
  }
}
