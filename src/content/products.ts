import type { Product } from './types'

export const products: readonly Product[] = [
  {
    name: 'Manda Aí',
    url: 'https://mandai.ia.br',
    description:
      'Instagram DM automation SaaS for small businesses, with keyword rules, a visual flow builder and an AI agent powered by Claude. Live, with its first paying subscriber acquired organically.',
    stack: ['React 19', 'TypeScript', 'Node.js/Express', 'Prisma', 'PostgreSQL', 'Stripe'],
  },
  {
    name: 'WoodFlow',
    url: '[REVISAR: WoodFlow tem URL pública?]',
    description:
      'Multi-tenant SaaS for woodworking shops, with a WhatsApp integration that logs entries into the system and an admin panel showing usage per customer.',
    stack: ['TypeScript', 'Stripe', 'OpenAI API'],
  },
]
