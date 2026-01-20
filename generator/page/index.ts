import { generateApiSchema } from '../api/complete/genApiSchema';
import { writeFile, GeneratorBaseObject } from '../utils';
import { generateColumns } from './components/genColumns';
import { generateCreateDialog } from './components/genCreateDialog';
import { generateDeleteDialog } from './components/genDeleteDialog';
import { generateEntityForm } from './components/genEntityForm';
import { generatePageFilters } from './components/genPageFilters';
import { generateUpdateDialog } from './components/genUpdateDialog';
import { generateEndpointConstants } from './constants/genEndpointConstants';
import { generateCreateHook } from './hooks/genCreateEntity';
import { generateDeleteHook } from './hooks/genDeleteEntity';
import { generateFindPaginatedHook } from './hooks/genFindPaginatedEntity';
import { generateGetByIdHook } from './hooks/genGetEntity';
import { generateUpdateHook } from './hooks/genUpdateEntity';
import { generateListPage } from './page/genListPage';
import { genViewRecordPage } from './page/genViewRecordPage';

function generatePages(obj: GeneratorBaseObject) {
  const listPage = generateListPage(obj);
  writeFile(listPage.template, listPage.path);

  const mainPage = genViewRecordPage(obj);
  writeFile(mainPage.template, mainPage.path);
}

function generateConstants(obj: GeneratorBaseObject) {
  const apiSchema = generateApiSchema(obj);
  writeFile(apiSchema.template, apiSchema.path);

  const endpointConstants = generateEndpointConstants(obj);
  writeFile(endpointConstants.template, endpointConstants.path);
}

function generateComponents(obj: GeneratorBaseObject) {
  const createDialog = generateCreateDialog(obj);
  writeFile(createDialog.template, createDialog.path);

  const updateDialog = generateUpdateDialog(obj);
  writeFile(updateDialog.template, updateDialog.path);

  const deleteDialog = generateDeleteDialog(obj);
  writeFile(deleteDialog.template, deleteDialog.path);

  const entityForm = generateEntityForm(obj);
  writeFile(entityForm.template, entityForm.path);

  const pageFilters = generatePageFilters(obj);
  writeFile(pageFilters.template, pageFilters.path);

  const columns = generateColumns(obj);
  writeFile(columns.template, columns.path);
}

function generateHooks(obj: GeneratorBaseObject) {
  const getPaginatedHook = generateFindPaginatedHook(obj);
  writeFile(getPaginatedHook.template, getPaginatedHook.path);

  const createHook = generateCreateHook(obj);
  writeFile(createHook.template, createHook.path);

  const updateHook = generateUpdateHook(obj);
  writeFile(updateHook.template, updateHook.path);

  const deleteHook = generateDeleteHook(obj);
  writeFile(deleteHook.template, deleteHook.path);

  const getHook = generateGetByIdHook(obj);
  writeFile(getHook.template, getHook.path);
}

export function generateFront(obj: GeneratorBaseObject) {
  generatePages(obj);
  generateComponents(obj);
  generateHooks(obj);
  generateConstants(obj);
}
