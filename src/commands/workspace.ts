import { Command } from '../core/types';
import { ThemeManager } from '../storage/ThemeManager';

export class WorkspaceCommand implements Command {
  name = 'workspace';
  description = 'Manage workspaces (profiles)';
  
  constructor(private themeManager: ThemeManager) {}

  async execute(args: string[]): Promise<string> {
    if (args.length === 0) {
      return 'Usage: workspace create <name> | workspace switch <name> | workspace list';
    }

    const subcommand = args[0];

    switch (subcommand) {
      case 'create':
        return this.createWorkspace(args[1]);
      case 'switch':
        return this.switchWorkspace(args[1]);
      case 'list':
        return this.listWorkspaces();
      default:
        return `Unknown subcommand: ${subcommand}`;
    }
  }

  private createWorkspace(name: string): string {
    if (!name) {
      return 'Usage: workspace create <name>';
    }

    this.themeManager.createWorkspace(name);
    return `Workspace '${name}' created`;
  }

  private switchWorkspace(name: string): string {
    if (!name) {
      return 'Usage: workspace switch <name>';
    }

    if (this.themeManager.switchWorkspace(name)) {
      return `Switched to workspace: ${name}`;
    }
    
    return `Workspace not found: ${name}`;
  }

  private listWorkspaces(): string {
    // In a full implementation, this would list all workspaces
    const current = this.themeManager.getCurrentWorkspace();
    return `Current workspace: ${current?.name || 'default'}`;
  }
}