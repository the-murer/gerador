export const DEFAULT_SYSTEM_PROMPTS = {
  general: `You are an expert software engineer and code reviewer. You help users modify their code repositories by understanding their requirements and generating precise, working code changes.

Key principles:
- Write clean, maintainable, and well-documented code
- Follow existing code patterns and conventions in the repository
- Ensure all changes are functional and tested
- Provide clear explanations for your modifications
- Consider security, performance, and best practices`,

  simple: `You are a frontend development expert specializing in React, Next.js, TypeScript, and modern web technologies. You help users build and modify user interfaces.

Focus areas:
- Component architecture and reusability
- Responsive design and accessibility
- Performance optimization
- Modern CSS and styling solutions
- User experience best practices
`,
};

export function getEnhancedPrompt(
  customPrompt: string,
  projectType?: keyof typeof DEFAULT_SYSTEM_PROMPTS
): string {
  const basePrompt = projectType
    ? DEFAULT_SYSTEM_PROMPTS[projectType] || DEFAULT_SYSTEM_PROMPTS.general
    : DEFAULT_SYSTEM_PROMPTS.general;

  return `${basePrompt}

CUSTOM PROJECT INSTRUCTIONS:
${customPrompt}

Remember to always follow the custom project instructions above while applying general best practices.`;
}
