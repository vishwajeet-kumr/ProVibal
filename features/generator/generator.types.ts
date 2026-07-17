// features/generator/generator.types.ts — All shared interfaces for the generator domain

export const PROJECT_TYPES = [
  "web-app",
  "mobile-app",
  "api-backend",
  "chrome-extension",
  "cli-tool",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export const TECH_STACK_OPTIONS = [
  "default",
  "react-next",
  "vue-nuxt",
  "svelte-kit",
  "react-native",
  "flutter",
  "express-node",
  "fastapi-python",
  "django",
  "spring-boot",
  "go-fiber",
] as const;

export type TechStackPreference = (typeof TECH_STACK_OPTIONS)[number];

export interface ProjectInput {
  readonly projectName: string;
  readonly description: string;
  readonly projectType: ProjectType;
  readonly techStack: TechStackPreference;
}

export interface FoundationPrompt {
  readonly identity: string;
  readonly architectureRules: string;
  readonly codeQualityStandards: string;
  readonly securityRequirements: string;
  readonly deliveryFormat: string;
}

export interface ProjectMapEntry {
  readonly filePath: string;
  readonly responsibility: string;
}

export interface ProjectMapPrompt {
  readonly overview: string;
  readonly fileStructure: readonly ProjectMapEntry[];
}

export interface FeatureBuildStep {
  readonly order: number;
  readonly featureName: string;
  readonly prompt: string;
  readonly filesToCreate: readonly string[];
  readonly dependencies: readonly string[];
}

export interface FeatureBuildSequence {
  readonly steps: readonly FeatureBuildStep[];
}

export interface FollowUpPrompt {
  readonly order: number;
  readonly title: string;
  readonly prompt: string;
  readonly purpose: string;
}

export interface FollowUpChain {
  readonly prompts: readonly FollowUpPrompt[];
}

export interface PromptKit {
  readonly id?: string;
  readonly projectName: string;
  readonly projectType: ProjectType;
  readonly foundation: FoundationPrompt;
  readonly projectMap: ProjectMapPrompt;
  readonly featureSequence: FeatureBuildSequence;
  readonly followUpChain: FollowUpChain | null;
}
