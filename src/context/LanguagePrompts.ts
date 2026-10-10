/**
 * Prompts FIM (fill-in-the-middle) específicos por lenguaje.
 * Cada uno ajusta el tono, el formato esperado y las convenciones típicas.
 */
export interface LanguagePrompt {
  instruction: string;
  stopTokens?: string[];
}

const GENERIC: LanguagePrompt = {
  instruction:
    "Completa el código que falta en el marcador <fim>. Respeta la indentación " +
    "y el estilo del archivo. Devuelve SOLO el código, sin explicaciones ni fences.",
};

const PROMPTS: Record<string, LanguagePrompt> = {
  python: {
    instruction:
      "Eres un autocompletador de Python. Completa el código respetando PEP 8, " +
      "la indentación de 4 espacios y el estilo del archivo. Usa type hints si " +
      "el contexto los sugiere. Devuelve SOLO el código a insertar.",
    stopTokens: ["\n\nclass ", "\n\ndef ", "\n\n# "],
  },

  typescript: {
    instruction:
      "Eres un autocompletador de TypeScript. Completa el código respetando las " +
      "convenciones del archivo (comillas, punto y coma, indentación). Prefiere " +
      "tipos explícitos si el contexto los usa. Devuelve SOLO el código.",
  },

  typescriptreact: {
    instruction:
      "Eres un autocompletador de React + TypeScript. Completa el componente o " +
      "hook respetando el estilo del archivo (functional components, hooks). " +
      "Devuelve SOLO el código, sin envolverlo en fences.",
  },

  javascript: {
    instruction:
      "Eres un autocompletador de JavaScript. Completa el código respetando el " +
      "estilo del archivo. Devuelve SOLO el código.",
  },

  javascriptreact: {
    instruction:
      "Eres un autocompletador de React (JSX). Completa el componente respetando " +
      "el estilo. Devuelve SOLO el código.",
  },

  rust: {
    instruction:
      "Eres un autocompletador de Rust. Completa el código respetando ownership " +
      "y el estilo del archivo. Devuelve SOLO el código.",
  },

  go: {
    instruction:
      "Eres un autocompletador de Go. Completa el código respetando gofmt. " +
      "Devuelve SOLO el código.",
  },

  java: {
    instruction:
      "Eres un autocompletador de Java. Completa el código respetando las " +
      "convenciones del archivo. Devuelve SOLO el código.",
  },

  cpp: {
    instruction:
      "Eres un autocompletador de C++. Completa el código respetando el estilo " +
      "del archivo. Devuelve SOLO el código.",
  },

  c: {
    instruction:
      "Eres un autocompletador de C. Completa el código respetando el estilo " +
      "del archivo. Devuelve SOLO el código.",
  },

  shellscript: {
    instruction:
      "Eres un autocompletador de shell (bash/zsh). Completa el comando respetando " +
      "el estilo del script. Devuelve SOLO el código.",
  },

  sql: {
    instruction:
      "Eres un autocompletador de SQL. Completa la consulta respetando el dialecto " +
      "del archivo (PostgreSQL, MySQL, etc.). Devuelve SOLO el código.",
  },

  markdown: {
    instruction:
      "Eres un autocompletador de Markdown. Completa el contenido respetando el " +
      "estilo del documento. Devuelve SOLO el texto.",
  },
};

export function getLanguagePrompt(languageId: string): LanguagePrompt {
  return PROMPTS[languageId.toLowerCase()] ?? GENERIC;
}
