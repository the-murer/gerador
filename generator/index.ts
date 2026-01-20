import { generateFront } from './page';
import { generateApi } from './api';
import {
  askBooleanOption,
  askModelAttributes,
  askQuestion,
} from './generatorCli';
import { GeneratorBaseObject } from './utils';

// OBJETO BASE INICIAL
const baseObject: GeneratorBaseObject = {
  entity: '',
  apiPath: '',
  frontPath: '',
  initApi: false,
  initFront: false,
  model: {},
};

// RODA OS GERADORES
function generateFiles(formedObject: GeneratorBaseObject) {
  console.log('\nChamando a função geradora com os seguintes dados:');
  console.log(JSON.stringify(formedObject, null, 2));
  const { initApi, initFront } = formedObject;

  if (initApi) {
    generateApi(formedObject);
    console.log('Gerando API...');
  }

  if (initFront) {
    generateFront(formedObject);
    console.log('Gerando Página...');
  }

  console.log('Geramento terminalizado.');
}

// GERENCIADOR DE GERADOR
async function main() {
  baseObject.entity = await askQuestion('Nome da entidade:');
  baseObject.apiPath = await askQuestion('Caminho da API:');
  baseObject.frontPath = await askQuestion('Caminho do front:');
  baseObject.initApi = await askBooleanOption('Gerar API?');
  baseObject.initFront = await askBooleanOption('Gerar Página?');

  baseObject.model = await askModelAttributes();

  generateFiles(baseObject);
}

main();
