// import { plural } from "pluralize";
import fs from 'fs';
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
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s\-]+/g, '_')
    .toLowerCase();
}

function toPluralCamelCase(str: string): string {
  // return plural(toCamelCase(str));
  return toCamelCase(str) + 's';
}

function toPluralPascalCase(str: string): string {
  // return plural(toPascalCase(str));
  return toPascalCase(str) + 's';
}

function toPluralKebabCase(str: string): string {
  // return plural(toKebabCase(str));
  return toKebabCase(str) + 's';
}

function writeFile(content: string, pathName: string) {
  if (fs.existsSync(pathName)) {
    console.log(`File ${pathName} already exists`);
    return;
  }

  // Create directory if it doesn't exist
  const dir = pathName.substring(0, pathName.lastIndexOf('/'));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(pathName, content);
}

function mapObjectFields(
  model: BaseObject['model'],
  writeFunction: (name: string, value: string) => string,
) {
  return Object.entries(model).map(([key, value]) => writeFunction(key, value));
}

export interface InjectTemplateOptions {
  template: string;
  path: string;
  marker: string;
  position?: 'before' | 'after';
}

function injectTemplate(options: InjectTemplateOptions) {
  const { template, path, marker, position = 'after' } = options;

  if (!fs.existsSync(path)) {
    console.log(`File ${path} does not exist, skipping injection`);
    return;
  }

  const fileContent = fs.readFileSync(path, 'utf-8');
  const markerIndex = fileContent.indexOf(marker);

  if (markerIndex === -1) {
    console.log(`Marker "${marker}" not found in file ${path}, skipping injection`);
    return;
  }

  let newContent: string;

  if (position === 'before') {
    // Injeta antes do marcador
    const beforeMarker = fileContent.substring(0, markerIndex);
    const afterMarker = fileContent.substring(markerIndex);
    newContent = beforeMarker + template + afterMarker;
  } else {
    // Injeta depois do marcador (padrão)
    const beforeMarker = fileContent.substring(0, markerIndex + marker.length);
    const afterMarker = fileContent.substring(markerIndex + marker.length);
    newContent = beforeMarker + template + afterMarker;
  }

  fs.writeFileSync(path, newContent, 'utf-8');
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
  injectTemplate,
};

export interface BaseObject {
  entity: string;
  model: Record<string, string>;
  apiPath: string;
}

export interface GeneratorBaseObject extends BaseObject {
  initApi: boolean;
  initFront: boolean;
  frontPath: string;
}
