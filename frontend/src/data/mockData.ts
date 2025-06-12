import { Project } from '@/types';

export const mockProjects: Project[] = [
  {
    id: 'proj_crest_001',
    name: 'CREST - Estudo Piloto Alagoas',
    description: 'Coleta de dados para o projeto Respirar em cirurgias pediátricas de via aérea no estado de Alagoas.',
    goals: 'Desenvolver um protocolo ERAS específico para cirurgia de via aérea pediátrica, visando reduzir complicações e tempo de internação.',
    members: [
      { userId: 'userLead123', roles: ['ProjectLead', 'Researcher', 'FormDesigner', 'DataEntry'] },
      { userId: 'user456', roles: ['DataEntry', 'Researcher'] },
    ],
  },
  {
    id: 'proj_eras_002',
    name: 'ERAS Pediátrico - Hospital Central',
    description: 'Implementação e avaliação de protocolos ERAS em cirurgia torácica pediátrica no Hospital Central.',
    goals: 'Avaliar a eficácia do protocolo ERAS em reduzir o tempo de recuperação e complicações em pacientes pediátricos submetidos a cirurgia torácica.',
    members: [
      { userId: 'userLead123', roles: ['Researcher'] },
      { userId: 'anotherLeadUser', roles: ['ProjectLead'] },
    ],
  },
];