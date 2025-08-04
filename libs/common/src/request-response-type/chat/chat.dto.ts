// chat.dto.ts
import { createZodDto } from 'nestjs-zod';
import {
    CreateConversationBodySchema,
    CreateMessageBodySchema,
    GetListMessageQuerySchema,
    PaginatedMessagesSchema,
} from './chat.model';

export class CreateConversationBodyDTO extends createZodDto(CreateConversationBodySchema) { }

export class CreateMessageBodyDTO extends createZodDto(CreateMessageBodySchema) { }

export class GetListMessageQueryDTO extends createZodDto(GetListMessageQuerySchema) { }

export class PaginatedMessagesDTO extends createZodDto(PaginatedMessagesSchema) { }
