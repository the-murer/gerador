import { generateApiSchema } from '../api/complete/genApiSchema';
import { writeFile, GeneratorBaseObject } from '../utils';
import { generateColumns } from './components/genColumns';
import { generateCreateDialog } from './components/genCreateDialog';
import { generateDeleteDialog } from './components/genDeleteDialog';
import { generateEntityForm } from './components/genEntityForm';
import { generatePageFilters } from './components/genPageFilters';
import { generateUpdateDialog } from './components/genUpdateDialog';
import { generateEndpointConstants } from './constants/genEndpointConstants';
import { generateFrontSchemas } from './constants/genSchemas';
import { generateCreateHook } from './hooks/genCreateEntity';
import { generateDeleteHook } from './hooks/genDeleteEntity';
import { generateFindPaginatedHook } from './hooks/genFindPaginatedEntity';
import { generateGetByIdHook } from './hooks/genGetEntity';
import { generateUpdateHook } from './hooks/genUpdateEntity';
import { injectRoleSubject } from './injectors/injectorRoleSubject';
import { injectSidebarRoute } from './injectors/injectorSidebar';
import { generateListPage } from './page/genListPage';
import { genViewRecordPage } from './page/genViewRecordPage';
import { generateListRoute } from './routes/genListPage';
import { generateViewRecordRoute } from './routes/genViewRecordPage';

function generatePages(obj: GeneratorBaseObject) {
  const listPage = generateListPage(obj);
  writeFile(listPage.template, `${obj.frontPath}/${listPage.path}`);

  const mainPage = genViewRecordPage(obj);
  writeFile(mainPage.template, `${obj.frontPath}/${mainPage.path}`);
}

function generateConstants(obj: GeneratorBaseObject) {
  const schemas = generateFrontSchemas(obj);
  writeFile(schemas.template, `${obj.frontPath}/${schemas.path}`);

  const endpoints = generateEndpointConstants(obj);
  writeFile(endpoints.template, `${obj.frontPath}/${endpoints.path}`);
}

function generateComponents(obj: GeneratorBaseObject) {
  const createDialog = generateCreateDialog(obj);
  writeFile(createDialog.template, `${obj.frontPath}/${createDialog.path}`);

  const updateDialog = generateUpdateDialog(obj);
  writeFile(updateDialog.template, `${obj.frontPath}/${updateDialog.path}`);

  const deleteDialog = generateDeleteDialog(obj);
  writeFile(deleteDialog.template, `${obj.frontPath}/${deleteDialog.path}`);

  const entityForm = generateEntityForm(obj);
  writeFile(entityForm.template, `${obj.frontPath}/${entityForm.path}`);

  const pageFilters = generatePageFilters(obj);
  writeFile(pageFilters.template, `${obj.frontPath}/${pageFilters.path}`);

  const columns = generateColumns(obj);
  writeFile(columns.template, `${obj.frontPath}/${columns.path}`);
}

function generateHooks(obj: GeneratorBaseObject) {
  const getPaginatedHook = generateFindPaginatedHook(obj);
  writeFile(
    getPaginatedHook.template,
    `${obj.frontPath}/${getPaginatedHook.path}`,
  );

  const createHook = generateCreateHook(obj);
  writeFile(createHook.template, `${obj.frontPath}/${createHook.path}`);

  const updateHook = generateUpdateHook(obj);
  writeFile(updateHook.template, `${obj.frontPath}/${updateHook.path}`);

  const deleteHook = generateDeleteHook(obj);
  writeFile(deleteHook.template, `${obj.frontPath}/${deleteHook.path}`);

  const getHook = generateGetByIdHook(obj);
  writeFile(getHook.template, `${obj.frontPath}/${getHook.path}`);
}

function generateRoutes(obj: GeneratorBaseObject) {
  const listRoute = generateListRoute(obj);
  writeFile(listRoute.template, `${obj.frontPath}/${listRoute.path}`);

  const viewRecordRoute = generateViewRecordRoute(obj);
  writeFile(
    viewRecordRoute.template,
    `${obj.frontPath}/${viewRecordRoute.path}`,
  );
}

function injectCode(obj: GeneratorBaseObject) {
  injectRoleSubject(obj);
  injectSidebarRoute(obj);
}

export function generateFront(obj: GeneratorBaseObject) {
  generatePages(obj);
  generateComponents(obj);
  generateHooks(obj);
  generateConstants(obj);
  generateRoutes(obj);

  injectCode(obj);
}
