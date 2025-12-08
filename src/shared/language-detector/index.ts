/**
 * Language Detection Utility
 * Detects programming language from file path and provides language-specific patterns
 */

export type SupportedLanguage = 'typescript' | 'javascript' | 'python';

export interface LanguagePatterns {
  // Class and Interface patterns
  classDeclaration: RegExp;
  interfaceDeclaration: RegExp;
  abstractClass: RegExp;

  // Method patterns
  methodDeclaration: RegExp;
  publicMethod: RegExp;
  privateMethod: RegExp;

  // Control flow patterns
  switchStatement: RegExp;
  ifStatement: RegExp;

  // OOP patterns
  instanceOfCheck: RegExp;
  inheritance: RegExp;
  implementation: RegExp;

  // Import/Export patterns
  importStatement: RegExp;
  exportStatement: RegExp;

  // Type/Variable patterns
  variableDeclaration: RegExp;
  functionDeclaration: RegExp;

  // Comments
  singleLineComment: RegExp;
  multiLineCommentStart: RegExp;
  todoComment: RegExp;
}

export class LanguageDetector {
  detect(filePath: string): SupportedLanguage {
    const ext = filePath.toLowerCase().split('.').pop() || '';

    switch (ext) {
      case 'ts':
      case 'tsx':
        return 'typescript';

      case 'js':
      case 'jsx':
      case 'mjs':
      case 'cjs':
        return 'javascript';

      case 'py':
      case 'pyw':
        return 'python';

      default:
        // Default to typescript for unknown extensions
        return 'typescript';
    }
  }

  getPatterns(language: SupportedLanguage): LanguagePatterns {
    switch (language) {
      case 'typescript':
      case 'javascript':
        return this.getTypeScriptPatterns();

      case 'python':
        return this.getPythonPatterns();

      default:
        return this.getTypeScriptPatterns();
    }
  }

  private getTypeScriptPatterns(): LanguagePatterns {
    return {
      // Class and Interface
      classDeclaration: /class\s+\w+/g,
      interfaceDeclaration: /interface\s+\w+/g,
      abstractClass: /abstract\s+class\s+\w+/g,

      // Methods
      methodDeclaration: /\b\w+\s*\([^)]*\)\s*[:{]/g,
      publicMethod: /public\s+\w+\s*\([^)]*\)/g,
      privateMethod: /private\s+\w+\s*\([^)]*\)/g,

      // Control flow
      switchStatement: /switch\s*\([^)]*\)/g,
      ifStatement: /if\s*\([^)]*\)/g,

      // OOP
      instanceOfCheck: /instanceof\s+\w+/g,
      inheritance: /extends\s+\w+/g,
      implementation: /implements\s+\w+/g,

      // Imports/Exports
      importStatement: /import\s+.*from\s+['"][^'"]+['"]/g,
      exportStatement: /export\s+(class|function|const|interface)/g,

      // Variables/Functions
      variableDeclaration: /\b(const|let|var)\s+\w+/g,
      functionDeclaration: /function\s+\w+\s*\([^)]*\)/g,

      // Comments
      singleLineComment: /\/\/.*/g,
      multiLineCommentStart: /\/\*/g,
      todoComment: /\/\/\s*TODO:/gi,
    };
  }

  private getPythonPatterns(): LanguagePatterns {
    return {
      // Class and Interface
      classDeclaration: /class\s+\w+/g,
      interfaceDeclaration: /class\s+\w+\(Protocol\)/g, // Python uses Protocol for interfaces
      abstractClass: /class\s+\w+\(ABC\)/g,

      // Methods
      methodDeclaration: /def\s+\w+\s*\([^)]*\):/g,
      publicMethod: /def\s+\w+\s*\([^)]*\):/g, // Python: no explicit 'public'
      privateMethod: /def\s+_\w+\s*\([^)]*\):/g, // Python: _ prefix for private

      // Control flow
      switchStatement: /match\s+\w+:/g, // Python 3.10+ match statement
      ifStatement: /if\s+[^:]+:/g,

      // OOP
      instanceOfCheck: /isinstance\s*\([^)]+,\s*\w+\)/g,
      inheritance: /class\s+\w+\([^)]+\):/g,
      implementation: /class\s+\w+\([^)]+\):/g, // Python: inheritance and implementation are the same

      // Imports/Exports
      importStatement: /(?:from\s+[\w.]+\s+)?import\s+[\w, ]+/g,
      exportStatement: /^(?!_)\w+\s*=/gm, // Python: module-level assignments are "exports"

      // Variables/Functions
      variableDeclaration: /^\s*\w+\s*=/gm,
      functionDeclaration: /def\s+\w+\s*\([^)]*\):/g,

      // Comments
      singleLineComment: /#.*/g,
      multiLineCommentStart: /"""|'''/g,
      todoComment: /#\s*TODO:/gi,
    };
  }

  getSyntaxKeywords(language: SupportedLanguage): {
    class: string;
    interface: string;
    function: string;
    import: string;
    export: string;
    extends: string;
    implements: string;
  } {
    switch (language) {
      case 'typescript':
      case 'javascript':
        return {
          class: 'class',
          interface: 'interface',
          function: 'function',
          import: 'import',
          export: 'export',
          extends: 'extends',
          implements: 'implements',
        };

      case 'python':
        return {
          class: 'class',
          interface: 'Protocol',
          function: 'def',
          import: 'import',
          export: '', // Python doesn't have explicit export
          extends: '', // Python uses parentheses for inheritance
          implements: '', // Python uses parentheses for implementation
        };

      default:
        return this.getSyntaxKeywords('typescript');
    }
  }
}

// Singleton instance
export const languageDetector = new LanguageDetector();
