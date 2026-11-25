/**
 * Source: content/depoimentos.md (LinkedIn recommendations, public).
 * pt-BR quotes are the original text, unedited. en quotes are translations and are flagged as such.
 * `profileTitle` is the recommender's current LinkedIn title and is shown as written there.
 */

export const RECOMMENDATIONS_URL = 'https://www.linkedin.com/in/matheus-costa-francisco/details/recommendations/'

export type TestimonialCompany = 'Soluti Digital' | 'GAtec Gestão Agroindustrial' | 'RKM Sistemas'

export type TestimonialRelationship = 'same-team' | 'direct-supervisor'

export interface Testimonial {
  readonly name: string
  readonly profileTitle: string
  readonly company: TestimonialCompany
  readonly relationship: TestimonialRelationship
  /** ISO date (YYYY-MM-DD) of the recommendation. */
  readonly date: string
  readonly quote: {
    /** Original text, one entry per paragraph. */
    readonly 'pt-BR': readonly string[]
    readonly en: {
      readonly translatedFrom: 'pt-BR'
      readonly paragraphs: readonly string[]
    }
  }
}

export const testimonials: readonly Testimonial[] = [
  {
    name: 'Neilton Gomes',
    profileTitle:
      'Senior Software Engineer · Microservices · Distributed Systems Engineer · Fintech · PHP · Laravel · Node.js · Payments · PIX',
    company: 'Soluti Digital',
    relationship: 'same-team',
    date: '2026-02-28',
    quote: {
      'pt-BR': [
        'O Matheus é daqueles front-ends que você percebe rápido que não é só "faz tela".',
        'Trabalhamos juntos em vários projetos, mas o momento que mais deixou claro o nível dele foi quando precisávamos estruturar o design system da empresa. Ele não só assumiu a responsabilidade — ele construiu do zero: componentes reutilizáveis, empacotados e instaláveis via npm, com documentação de verdade, não aquela documentação que ninguém lê porque está incompleta.',
        'No mesmo período, automatizou todo o CI/CD do front-end e trouxe padrões de projeto onde faziam sentido de verdade — sem over-engineering, só onde trazia ganho real.',
        'Fora isso, a fidelidade dele com protótipos é absurda. O que está no Figma, está na tela. Não "parecido" — está lá.',
        'É o tipo de engenheiro que eleva o padrão técnico do time só de estar no projeto.',
      ],
      en: {
        translatedFrom: 'pt-BR',
        paragraphs: [
          'Matheus is one of those front-end developers you quickly realize does not just "build screens".',
          'We worked together on several projects, but the moment that made his level clearest was when we needed to structure the company design system. He did not just take on the responsibility — he built it from scratch: reusable components, packaged and installable via npm, with real documentation, not the kind nobody reads because it is incomplete.',
          'In the same period, he automated the whole front-end CI/CD and brought in design patterns where they really made sense — no over-engineering, only where they brought real gain.',
          'Beyond that, his fidelity to prototypes is outstanding. What is in Figma is on the screen. Not "similar" — it is there.',
          'He is the kind of engineer who raises the technical standard of the team just by being on the project.',
        ],
      },
    },
  },
  {
    name: 'Áiska Hacine',
    profileTitle: 'Product Owner | Gestão de Produtos | Transformação Digital | Experiência do Cliente e Inovação',
    company: 'Soluti Digital',
    relationship: 'same-team',
    date: '2023-10-17',
    quote: {
      'pt-BR': [
        'Tive a sorte de trabalhar com o Matheus no projeto da Emissão online.',
        'Inicialmente, ele ingressou como Front-end e logo assumiu também uma parte do Back-end, tendo uma rápida curva de aprendizado. Logo ele teve todo o entendimento do projeto, dominando as demandas.',
        'Além disso, tem muita flexibilidade em relação às mudanças. Ele demonstra respeito por cada papel na equipe, sempre entregando o que é solicitado. A comunicação é frequentemente um desafio na área de desenvolvimento, por isso sua habilidade em comunicar de forma clara e ágil é um verdadeiro trunfo para qualquer equipe de desenvolvimento.',
        'Sua capacidade de receber feedbacks e evoluir com eles é uma qualidade rara, e ele constantemente demonstra interesse em aprender e se compromete em realizar as entregas.',
        'Parabéns Matheus, continue sempre dedicado e estudando. Você vai longe!',
      ],
      en: {
        translatedFrom: 'pt-BR',
        paragraphs: [
          'I was lucky to work with Matheus on the Emissão online project.',
          'He joined as a front-end developer and soon took on part of the back-end as well, with a fast learning curve. He quickly understood the whole project and mastered its demands.',
          'He is also very flexible about changes. He shows respect for every role on the team and always delivers what is asked. Communication is often a challenge in software development, so his ability to communicate clearly and quickly is a real asset for any development team.',
          'His ability to receive feedback and grow from it is a rare quality, and he constantly shows interest in learning and commits to making deliveries.',
          'Congratulations Matheus, stay dedicated and keep studying. You will go far!',
        ],
      },
    },
  },
  {
    name: 'William Fontanetti',
    profileTitle: 'Software Developer at Jambo | ReactJs | React Native | Mobile Developer | UI/UX Enthusiast',
    company: 'GAtec Gestão Agroindustrial',
    relationship: 'direct-supervisor',
    date: '2022-10-10',
    quote: {
      'pt-BR': [
        'Matheus trabalhou com minha equipe por cerca de 1 ano, sempre se mostrou prestativo, sendo solicito ao apoiar nossa equipe em novos desafios, treinar novos colaboradores e na comunicação com nossos clientes.',
        'Ele sempre teve o anseio por buscar coisas novas e se atualizar, sendo assim, em nossa equipe ele acabou conseguindo agregar no desenvolvimento de novas features para os nossos produtos, onde no qual eu designei tarefas para que ele pudesse implementar um novo mapa para nosso aplicativo e ele cumpriu com sucesso.',
        'Acredito que o Matheus possua um bom conhecimento técnico, uma visão criativa do mundo e também o tato para lidar com pessoas, o que sem duvidas faz dele além de um bom desenvolvedor, um ótimo funcionário para se ter em um projeto seja ele de pequeno, médio ou grande porte.',
      ],
      en: {
        translatedFrom: 'pt-BR',
        paragraphs: [
          'Matheus worked with my team for about 1 year. He was always helpful, ready to support our team in new challenges, train new colleagues and communicate with our clients.',
          'He always wanted to look for new things and keep up to date, so on our team he was able to contribute to the development of new features for our products. I assigned him tasks so he could implement a new map for our app, and he delivered it successfully.',
          'I believe Matheus has solid technical knowledge, a creative view of the world and also the tact to deal with people, which without a doubt makes him not only a good developer but a great employee to have on a project, whether small, medium or large.',
        ],
      },
    },
  },
  {
    name: 'Victor Colacelli',
    profileTitle: 'Analista de Operações',
    company: 'RKM Sistemas',
    relationship: 'same-team',
    date: '2022-10-07',
    quote: {
      'pt-BR': [
        'Trabalhei com o Matheus na área de suporte e pude perceber que é um profissional empenhado e proativo!',
        'Sempre buscando dominar as metodologias e tecnologias necessárias para executar da melhor maneira as atividades sobre sua responsabilidade. Além disso, demostrava uma enorme resiliência na qual sempre era o primeiro a trazer e implementar soluções para qualquer problema técnico ou processual.',
      ],
      en: {
        translatedFrom: 'pt-BR',
        paragraphs: [
          'I worked with Matheus in the support area and could see he is a committed and proactive professional!',
          'He was always looking to master the methodologies and technologies needed to carry out his responsibilities in the best way. He also showed great resilience, and was always the first to bring and implement solutions for any technical or process problem.',
        ],
      },
    },
  },
  {
    name: 'Gabriel Vicente',
    profileTitle:
      'Senior Mobile Developer & Tech Lead · React Native | Arquitetura Offline-First | IA aplicada ao desenvolvimento',
    company: 'GAtec Gestão Agroindustrial',
    relationship: 'same-team',
    date: '2022-09-09',
    quote: {
      'pt-BR': [
        'Matheus demonstrou uma grande evolução enquanto trabalhávamos juntos, mesmo chegando na equipe com pouco domínio da nossa stack, em pouco tempo ele foi se adaptando e se aperfeiçoando, mostrando que não importava o que jogassem na suas mãos ele conseguiria entregar um produto com pouco tempo de estudo e perseverança. Nos ajudou e muito em uma feature que queríamos implementar em nossas aplicações, se dedicando em ir atrás, estudar, pesquisar qual a melhor maneira e como fazer em nossos projetos. Isso mostrou o quão flexível e prestativo ele é, independente de qual tecnologia ele precise usar.',
      ],
      en: {
        translatedFrom: 'pt-BR',
        paragraphs: [
          'Matheus showed great growth while we worked together. Even though he joined the team with little command of our stack, in a short time he adapted and improved, showing that no matter what was put in his hands, he could deliver a product with little study time and perseverance. He helped us a lot with a feature we wanted to implement in our applications, dedicating himself to go after it, study and research the best way and how to do it in our projects. This showed how flexible and helpful he is, regardless of which technology he needs to use.',
        ],
      },
    },
  },
  {
    name: 'Gian Paulo Seneda',
    profileTitle:
      'Front End Developer | React, React Native, TypeScript, Next.js | Design Systems, UX, Testing, APIs | Building Digital Products | EN/PT/ES',
    company: 'GAtec Gestão Agroindustrial',
    relationship: 'same-team',
    date: '2022-09-01',
    quote: {
      'pt-BR': [
        'Matheus foi um grande colega de trabalho pois desde o início se mostrou muito prestativo e solícito em meu início de carreira, me ajudando com assuntos técnicos e me apoiando na caminhada. Tem conhecimento amplo e muita energia para se desenvolver, diligente e flexível. Embora tenha trabalhado com ele no setor Mobile, pude ver suas competências em outras indústrias, como desenvolvimento Web.',
      ],
      en: {
        translatedFrom: 'pt-BR',
        paragraphs: [
          'Matheus was a great coworker because from the start he was very helpful and attentive at the beginning of my career, helping me with technical matters and supporting me along the way. He has broad knowledge and a lot of energy to grow, and is diligent and flexible. Although I worked with him in the Mobile sector, I could see his skills in other industries, such as Web development.',
        ],
      },
    },
  },
]
