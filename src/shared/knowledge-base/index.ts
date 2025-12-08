/**
 * Knowledge Base Documentation Loader
 * Loads and searches SOLID principle documentation from markdown files
 */

import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { existsSync } from 'fs';

export interface DocumentationSection {
  principle: string;
  content: string;
  filePath: string;
  section?: string;
}

export class KnowledgeBase {
  private docsPath: string;
  private cache: Map<string, string> = new Map();

  constructor(docsPath?: string) {
    // Default to ../docs/specs relative to project root
    this.docsPath = docsPath || resolve(process.cwd(), '../docs/specs');
  }

  /**
   * Load documentation for a specific SOLID principle
   */
  async loadPrincipleDoc(principle: 'SRP' | 'OCP' | 'LSP' | 'ISP' | 'DIP'): Promise<string> {
    const cacheKey = `solid-${principle}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Try multiple possible paths for SOLID documentation
      const possiblePaths = [
        join(this.docsPath, 'principles/SOLID.md'),
        join(this.docsPath, 'principles/solid-gang-of-four.md'),
        join(this.docsPath, 'principles/design-principles-overview.md'),
      ];

      for (const path of possiblePaths) {
        if (existsSync(path)) {
          const content = await readFile(path, 'utf-8');

          // Extract section for specific principle
          const section = this.extractPrincipleSection(content, principle);
          if (section) {
            this.cache.set(cacheKey, section);
            return section;
          }
        }
      }

      throw new Error(`Documentation for ${principle} not found in knowledge base at ${this.docsPath}`);
    } catch (error) {
      throw new Error(`Failed to load ${principle} documentation: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Extract a specific principle section from SOLID documentation
   */
  private extractPrincipleSection(content: string, principle: string): string | null {
    const principleNames = {
      SRP: ['Single Responsibility', 'SRP', 'Single Responsibility Principle'],
      OCP: ['Open/Closed', 'OCP', 'Open/Closed Principle', 'Open-Closed'],
      LSP: ['Liskov Substitution', 'LSP', 'Liskov Substitution Principle'],
      ISP: ['Interface Segregation', 'ISP', 'Interface Segregation Principle'],
      DIP: ['Dependency Inversion', 'DIP', 'Dependency Inversion Principle'],
    };

    const names = principleNames[principle as keyof typeof principleNames];

    for (const name of names) {
      // Try to find section with this heading
      const regex = new RegExp(`#+\\s*${name}[^#]*?(?=\\n#+|$)`, 'is');
      const match = content.match(regex);
      if (match) {
        return match[0];
      }
    }

    return null;
  }

  /**
   * Search for specific content in documentation
   */
  async searchDocumentation(query: string): Promise<DocumentationSection[]> {
    const results: DocumentationSection[] = [];

    try {
      const docsToSearch = [
        { path: 'principles/SOLID.md', principle: 'SOLID' },
        { path: 'principles/solid-gang-of-four.md', principle: 'SOLID-GoF' },
        { path: 'principles/base-design-principles.md', principle: 'Base Principles' },
        { path: 'principles/design-principles-overview.md', principle: 'Overview' },
      ];

      for (const doc of docsToSearch) {
        const fullPath = join(this.docsPath, doc.path);
        if (existsSync(fullPath)) {
          const content = await readFile(fullPath, 'utf-8');

          // Simple search - could be enhanced with fuzzy matching
          if (content.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              principle: doc.principle,
              content: this.extractRelevantSection(content, query),
              filePath: doc.path,
            });
          }
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    }

    return results;
  }

  /**
   * Extract relevant section containing the query
   */
  private extractRelevantSection(content: string, query: string, contextLines: number = 10): string {
    const lines = content.split('\n');
    const queryLower = query.toLowerCase();

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(queryLower)) {
        const start = Math.max(0, i - contextLines);
        const end = Math.min(lines.length, i + contextLines);
        return lines.slice(start, end).join('\n');
      }
    }

    return content.substring(0, 500); // Return first 500 chars if not found
  }

  /**
   * Get documentation reference URL
   */
  getDocumentationReference(_principle: string, section?: string): string {
    const baseUrl = 'docs/specs/principles';
    const fileName = 'SOLID.md';

    if (section) {
      return `${baseUrl}/${fileName}#${section.toLowerCase().replace(/\s+/g, '-')}`;
    }

    return `${baseUrl}/${fileName}`;
  }

  /**
   * Get pattern documentation for fixing violations
   */
  async getPatternDocumentation(patternName: string): Promise<string | null> {
    try {
      const patternPaths = [
        join(this.docsPath, 'patterns/gang-of-four-quick-reference.md'),
        join(this.docsPath, `patterns/creational/${patternName.toLowerCase()}.md`),
        join(this.docsPath, `patterns/behavioral/${patternName.toLowerCase()}.md`),
        join(this.docsPath, `patterns/structural/${patternName.toLowerCase()}.md`),
      ];

      for (const path of patternPaths) {
        if (existsSync(path)) {
          const content = await readFile(path, 'utf-8');
          return this.extractPatternSection(content, patternName);
        }
      }

      return null;
    } catch (error) {
      console.error(`Failed to load pattern documentation for ${patternName}:`, error);
      return null;
    }
  }

  /**
   * Extract specific pattern section from documentation
   */
  private extractPatternSection(content: string, patternName: string): string {
    // Try to find section with pattern name
    const regex = new RegExp(`#+\\s*${patternName}[^#]*?(?=\\n#+|$)`, 'is');
    const match = content.match(regex);

    if (match) {
      return match[0];
    }

    return content.substring(0, 1000); // Return first 1000 chars as fallback
  }

  /**
   * Check if knowledge base is accessible
   */
  async isAvailable(): Promise<boolean> {
    try {
      const solidPath = join(this.docsPath, 'principles/SOLID.md');
      return existsSync(solidPath);
    } catch {
      return false;
    }
  }
}
