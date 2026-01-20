import { generatePages } from "./page";
import { generateExtras } from "./extras";
import { generateApi } from "./api";
import {
  askBooleanOption,
  askModelAttributes,
  askQuestion,
} from "./generatorCli";
import { GeneratorBaseObject } from "./utils";

// OBJETO BASE INICIAL
const baseObject: GeneratorBaseObject = {
  entity: "",
  apiPath: "",
  path: "",
  project: "",
  initApi: false,
  initPage: false,
  model: {},
};

// RODA OS GERADORES
function generateFiles(baseObject: GeneratorBaseObject) {
  console.log("\nChamando a função geradora com os seguintes dados:");
  console.log(JSON.stringify(baseObject, null, 2));
  const { initApi, initPage } = baseObject;

  if (initApi) {
    generateApi(baseObject);
    console.log("Gerando API...");
  }

  if (initPage) {
    generatePages(baseObject);
    console.log("Gerando Página...");
  }

  generateExtras(baseObject);
  console.log("Gerando Extras...");
}

// GERENCIADOR DE GERADOR
async function main() {
  baseObject.entity = await askQuestion("Nome da entidade:");
  baseObject.path = await askQuestion("Caminho do arquivo:");
  baseObject.apiPath = await askQuestion("Caminho da API:");
  baseObject.project = await askQuestion("Caminho do projeto:");
  baseObject.initApi = await askBooleanOption("Gerar API?");
  baseObject.initPage = await askBooleanOption("Gerar Página?");

  baseObject.model = await askModelAttributes();

  generateFiles(baseObject);
}

main();
