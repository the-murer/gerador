import readline from "readline";
import {
  toCamelCase,
  toPascalCase,
  toKebabCase,
  toSnakeCase,
  toPluralCamelCase,
  toPluralPascalCase,
  toPluralKebabCase,
} from "./utils";
import { BaseObject } from "./utils";

declare global {
  interface String {
    camelCase(): string;
    pascalCase(): string;
    kebabCase(): string;
    snakeCase(): string;
    pluralCamel(): string;
    pluralPascal(): string;
    pluralKebab(): string;
  }
}

String.prototype.camelCase = function () {
  return toCamelCase(this as string);
};

String.prototype.pascalCase = function () {
  return toPascalCase(this as string);
};

String.prototype.kebabCase = function () {
  return toKebabCase(this as string);
};

String.prototype.snakeCase = function () {
  return toSnakeCase(this as string);
};

String.prototype.pluralCamel = function () {
  return toPluralCamelCase(this as string);
};

String.prototype.pluralPascal = function () {
  return toPluralPascalCase(this as string);
};

String.prototype.pluralKebab = function () {
  return toPluralKebabCase(this as string);
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question + " ", (answer: string) => resolve(answer.trim()));
  });
}

// PERGUNTA BOOLEANA
export async function askBooleanOption(label: string): Promise<boolean> {
  return new Promise((resolve) => {
    let selected = false;

    function render() {
      console.clear();
      console.log(`Pressione Espaço para alterar e Enter para confirmar:\n`);
      console.log(`${selected ? "[x]" : "[ ]"} ${label}`);
    }

    function onKeyPress(_: null, key: { name: string }) {
      if (key.name === "space") {
        selected = !selected;
        render();
      } else if (key.name === "return") {
        process.stdin.off("keypress", onKeyPress);
        resolve(selected);
      }
    }

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on("keypress", onKeyPress);
    render();
  });
}

// ITERADOR DE ATRIBUTOS
export async function askModelAttributes() {
  console.log("\nAgora vamos definir os atributos do modelo.");
  const baseObjectModel: BaseObject["model"] = {};
  while (true) {
    const name = await askQuestion(
      "Nome do atributo (ou Enter para finalizar):"
    );
    if (!name) break;
    const type = await askQuestion(`Tipo do atributo "${name}":`);
    baseObjectModel[name] = type;
  }
  rl.close();
  return baseObjectModel;
}

// JUST TO GARANTEE THE METHODS ARE CALLED
export const enableExtensions = () => {}