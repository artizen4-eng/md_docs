export interface TextStyle {
  fontSize: number;
  bold?: boolean;
  italic?: boolean;
  lineHeight?: number;
  letterSpacing?: number;
  paragraphSpacing?: number;
  spacingAfter?: number;
  indent?: number;
}

export interface CodeBlockConfig {
  action: 'remove' | 'keep' | 'quote';
  keepBackticks?: boolean;
  style?: 'monospace' | 'normal';
}

export interface ListConfig {
  bullet: string;
  indent: number;
}

export interface TableConfig {
  border: boolean;
  align: 'left' | 'center' | 'right';
  spacing: number;
}

export interface ConverterPreset {
  id: string;
  name: string;
  description?: string;
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  body: TextStyle;
  bulletList: ListConfig;
  numberedList: ListConfig;
  inlineCode: CodeBlockConfig;
  codeBlock: CodeBlockConfig;
  blockquote: TextStyle;
  table: TableConfig;
  createdAt?: number;
  updatedAt?: number;
}

export interface ConverterState {
  currentPreset: ConverterPreset;
  customPresets: ConverterPreset[];
  inputMarkdown: string;
  outputDocument: string;
}
