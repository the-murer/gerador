import { generateCreateHandler } from './complete/handlers/genCreateHandler';
import { generateUpdateHandler } from './complete/handlers/genUpdateHandler';
import { generateDeleteHandler } from './complete/handlers/genDeleteHandler';
import { generateGetByIdHandler } from './complete/handlers/genGetByIdHandler';
import { generateGetPaginatedHandler } from './complete/handlers/genGetPaginatedHandler';
import { BaseObject, writeFile } from '../utils';
import { generateApiSchema } from './complete/genApiSchema';
import { generateApiRepository } from './complete/genApiRepository';
import { generateApiController } from './complete/genApiController';
import { generateApiModule } from './complete/genApiModule';
import { generateFindDto } from './complete/dto/genFindDto';
import { generateCreateDto } from './complete/dto/genCreateDto';
import { injectAppModule } from './injectors/injectAppModule';
import { injectApiRole } from './injectors/injectApiRole';

function generateApiHanlders(obj: BaseObject) {
  const create = generateCreateHandler(obj);
  writeFile(create.template, create.path);

  const update = generateUpdateHandler(obj);
  writeFile(update.template, update.path);

  const deleteHandler = generateDeleteHandler(obj);
  writeFile(deleteHandler.template, deleteHandler.path);

  const getByIdHandler = generateGetByIdHandler(obj);
  writeFile(getByIdHandler.template, getByIdHandler.path);

  const getPaginatedHandler = generateGetPaginatedHandler(obj);
  writeFile(getPaginatedHandler.template, getPaginatedHandler.path);
}

function generateModule(obj: BaseObject) {
  const schema = generateApiSchema(obj);
  writeFile(schema.template, schema.path);

  const repository = generateApiRepository(obj);
  writeFile(repository.template, repository.path);

  const controller = generateApiController(obj);
  writeFile(controller.template, controller.path);

  const module = generateApiModule(obj);
  writeFile(module.template, module.path);
}

function generateDto(obj: BaseObject) {
  const createDto = generateCreateDto(obj);
  writeFile(createDto.template, createDto.path);

  const findDto = generateFindDto(obj);
  writeFile(findDto.template, findDto.path);
}

function injectCode(obj: BaseObject) {
  injectAppModule(obj);
  injectApiRole(obj);
}

export function generateApi(obj: BaseObject) {
  generateApiHanlders(obj);
  generateModule(obj);
  generateDto(obj);

  injectCode(obj);
}
