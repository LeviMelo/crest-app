export interface User {
    id: string;
    name: string;
    email: string;
  }
  
  export interface ProjectMember {
    userId: string;
    roles: string[];
  }
  
  export interface Project {
    id: string;
    name: string;
    description: string;
    members: ProjectMember[];
  }