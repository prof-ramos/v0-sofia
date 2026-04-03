export interface AsofInstitutionalData {
  field: string;
  data: string;
}

export const ASOF_DATA: AsofInstitutionalData[] = [
  { field: 'Presidente', data: 'Manuel Alves Bezerra' },
  { field: 'Vice-Presidente', data: 'Cesar Dunstan Fleury Curado' },
  { field: 'Diretora Executiva', data: 'Aline de Souza' },
  { field: 'Diretor Financeiro', data: 'Ariel Antonio Seleme' },
  { field: 'Presidente do Conselho Fiscal', data: 'Sérgio Gondim Simão' },
  { field: 'Posse da diretoria', data: '30 de junho de 2025' },
  { field: 'Associados', data: '~763' },
  { field: 'Sede', data: 'Esplanada dos Ministérios, Bloco H, 1.º Subsol — Brasília/DF, CEP 70.170-900' },
  { field: 'E-mail', data: 'contato@asof.org.br' },
  { field: 'Site', data: 'https://www.asof.org.br' },
];

export function formatAsofData(data: AsofInstitutionalData[]): string {
  let table = '| Campo | Dado |\n|---|---|\n';
  data.forEach(item => {
    table += `| ${item.field} | ${item.data} |\n`;
  });
  return table.trim();
}
