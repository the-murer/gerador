// import { plural } from "pluralize";
import fs from "fs";
function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s\-]+/g, "_")
    .toLowerCase();
}

function toPluralCamelCase(str: string): string {
  // return plural(toCamelCase(str));
  return toCamelCase(str) + "s";
}

function toPluralPascalCase(str: string): string {
  // return plural(toPascalCase(str));
  return toPascalCase(str) + "s";
}

function toPluralKebabCase(str: string): string {
  // return plural(toKebabCase(str));
  return toKebabCase(str) + "s";
}

function writeFile(content: string, pathName: string) {
  if (fs.existsSync(pathName)) {
    console.log(`File ${pathName} already exists`);
    return;
  }

  // Create directory if it doesn't exist
  const dir = pathName.substring(0, pathName.lastIndexOf("/"));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(pathName, content);
}

function mapObjectFields(
  model: BaseObject["model"],
  writeFunction: (name: string, value: string) => string
) {
  return Object.entries(model).map(([key, value]) => writeFunction(key, value));
}

export {
  toCamelCase,
  toPascalCase,
  toKebabCase,
  toSnakeCase,
  toPluralCamelCase,
  toPluralPascalCase,
  toPluralKebabCase,
  writeFile,
  mapObjectFields,
};


export interface BaseObject {
  apiPath: string;
  entity: string;
  project: string;
  model: Record<string, string>;
}

export interface GeneratorBaseObject extends BaseObject {
  path: string;
  initApi: boolean;
  initPage: boolean;
}
