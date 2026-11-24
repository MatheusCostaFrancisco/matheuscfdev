import type { SkillGroup } from './types'

export const skills: readonly SkillGroup[] = [
  { group: 'Front-end', items: ['React', 'Vue.js', 'TypeScript', 'JavaScript', 'React Native', 'Tailwind CSS', 'Vite'] },
  { group: 'Back-end and data', items: ['Node.js', 'Express', 'Laravel', 'PostgreSQL', 'Prisma', 'SQL'] },
  { group: 'Cloud and DevOps', items: ['AWS', 'GitHub Actions', 'Docker', 'Kubernetes', 'Terraform'] },
  { group: 'Quality and process', items: ['Jest', 'Vitest', 'Testing Library', 'Scrum', 'Kanban'] },
  { group: 'Applied AI', items: ['LLMs (Claude, OpenAI)', 'AI agents', 'Spec-driven development'] },
]
