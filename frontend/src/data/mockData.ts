import { Project } from '@/types';

export const mockProjects: Project[] = [
  {
    id: 'proj_crest_001',
    name: 'CREST - Estudo Piloto Alagoas',
    description: 'Coleta de dados para o projeto Respirar em cirurgias pediátricas de via aérea no estado de Alagoas.',
    members: [
      { userId: 'userLead123', roles: ['ProjectLead', 'Researcher'] },
      { userId: 'user456', roles: ['DataEntry'] },
    ],
  },
  {
    id: 'proj_eras_002',
    name: 'ERAS Pediátrico - Hospital Central',
    description: 'Implementação e avaliação de protocolos ERAS em cirurgia torácica pediátrica no Hospital Central.',
    members: [
      { userId: 'userLead123', roles: ['Researcher'] },
      { userId: 'anotherLeadUser', roles: ['ProjectLead'] },
    ],
  },
];