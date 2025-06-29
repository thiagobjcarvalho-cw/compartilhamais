import type { ExampleModel } from "./model-example";

export function fetchExampleData(): Promise<ExampleModel[]> {
  // Simulação de uma chamada HTTP
  return Promise.resolve([{ id: 1, name: "Instituição Exemplo" }]);
}
