import { BaseObject } from '../../utils';

export function generateApiController(obj: BaseObject) {
  const { entity, apiPath } = obj;

  const template = `
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Find${entity.pascalCase()}ByIdHandler } from './handlers/find-${entity.kebabCase()}-by-id.handler';
import { Create${entity.pascalCase()}Handler } from './handlers/create-${entity.kebabCase()}.handler';
import { Create${entity.pascalCase()}Dto } from './dto/create-${entity.kebabCase()}.dto';
import { Find${entity.pluralPascal()}Handler } from './handlers/find-${entity.pluralKebab()}.handler';
import { Find${entity.pluralPascal()}Dto } from './dto/find-${entity.pluralKebab()}.dto';
import { Update${entity.pascalCase()}Handler } from './handlers/update-${entity.kebabCase()}.handler';
import { UniqueIdDto } from '@app/app/dtos/unique-id.dto';
import { Roles } from '@app/auth/roles/decorator';

@Controller('${entity.pluralKebab()}')
export class ${entity.pluralPascal()}Controller {
  constructor(
    private readonly findByIdHandler: Find${entity.pascalCase()}ByIdHandler,
    private readonly findHandler: Find${entity.pluralPascal()}Handler,
    private readonly createHandler: Create${entity.pascalCase()}Handler,
    private readonly updateHandler: Update${entity.pascalCase()}Handler,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @Roles({ action: 'read', subject: '${entity.pascalCase()}' })
  async findById(@Param() { id }: UniqueIdDto) {
    const result = await this.findByIdHandler.execute({ id });

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @Roles({ action: 'update', subject: '${entity.pascalCase()}' })
  async update(@Param() { id }: UniqueIdDto, @Body() updateDto: Create${entity.pascalCase()}Dto) {
    const result = await this.updateHandler.execute({ id, ...updateDto });

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @Roles({ action: 'read', subject: '${entity.pascalCase()}' })
  async find(@Query() findDto: Find${entity.pluralPascal()}Dto) {
    const result = await this.findHandler.execute(findDto);

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  @Roles({ action: 'create', subject: '${entity.pascalCase()}' })
  async create(@Body() createDto: Create${entity.pascalCase()}Dto) {
    const result = await this.createHandler.execute(createDto);

    return result;
  }
}
`;
  return {
    template,
    path: `${apiPath}/${entity.kebabCase()}/${entity.pluralKebab()}.controller.ts`,
  };
}
