/// <reference types="vite/client" />

// Se você tiver arquivos CSS/SCSS
declare module '*.css';
declare module '*.scss';

// Apenas declare suas variáveis de ambiente personalizadas
// NÃO redeclare PROD, DEV, MODE - eles já existem no Vite
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  // NÃO inclua PROD, DEV, MODE aqui
}

// Esta interface já existe no Vite, não precisa redeclarar
// interface ImportMeta {
//   readonly env: ImportMetaEnv;
// }
