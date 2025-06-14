// src/pages/project/MembersAndRolesPage.tsx
import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { PiUsersThreeDuotone, PiPlus, PiShieldDuotone } from 'react-icons/pi';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { InputField } from '@/components/ui/InputField';
import { Checkbox } from '@/components/ui/Checkbox';

// Mock Data based on UI/UX Plan
const mockMembers = [
    { id: 'userLead123', name: 'Dr. User Lead', email: 'dr.lead@example.com', roles: ['ProjectLead', 'Researcher'] },
    { id: 'user456', name: 'Alex Researcher', email: 'alex.r@example.com', roles: ['Researcher', 'DataEntry'] },
    { id: 'user789', name: 'Casey Data-Clerk', email: 'casey.d@example.com', roles: ['DataEntry'] },
];

const mockRoles = [
    { id: 'ProjectLead', name: 'Project Lead', description: 'Full access to project settings, members, and forms.' },
    { id: 'Researcher', name: 'Researcher', description: 'Can view data, reports, and submit data.' },
    { id: 'DataEntry', name: 'Data Entry', description: 'Can only enter and submit data via assigned forms.' },
];

const MembersAndRolesPage: React.FC = () => {
    // For now, we can just mock a selected user
    const selectedMember = mockMembers[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members & Roles"
        subtitle="Manage project access and define custom roles with granular permissions."
        icon={PiUsersThreeDuotone}
      >
        <Button>
            <PiPlus className="mr-2" />
            Invite New Member
        </Button>
      </PageHeader>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Lists */}
        <div className="lg:col-span-4 space-y-6">
            <Card>
                <CardHeader><CardTitle>Project Members</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {mockMembers.map(member => (
                            <div key={member.id} className="flex items-center p-2 rounded-lg hover:bg-accent cursor-pointer">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&size=32&color=fff&font-size=0.40&bold=true`} alt={member.name} className="w-8 h-8 rounded-full mr-3"/>
                                <div>
                                    <p className="text-sm font-medium">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Project Roles</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {mockRoles.map(role => (
                            <div key={role.id} className="flex items-start p-2 rounded-lg hover:bg-accent cursor-pointer">
                                <PiShieldDuotone className="w-5 h-5 mr-3 mt-1 text-primary"/>
                                <div>
                                    <p className="text-sm font-medium">{role.name}</p>
                                    <p className="text-xs text-muted-foreground">{role.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Right Panel: Editor/Details */}
        <div className="lg:col-span-8">
            <Card>
                <CardHeader>
                    <CardTitle>{selectedMember.name}</CardTitle>
                    <CardDescription>Assign or un-assign roles for this member.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <InputField id="email" label="Email" type="email" value={selectedMember.email} disabled />
                        <div>
                            <label className="text-sm font-medium">Roles</label>
                            <div className="mt-2 space-y-2 p-3 border rounded-lg bg-background/50">
                                {mockRoles.map(role => (
                                    <label key={role.id} className="flex items-center gap-2">
                                        <Checkbox 
                                            id={`role-${role.id}`} 
                                            checked={selectedMember.roles.includes(role.id)} 
                                        />
                                        <span>{role.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <Button className="w-full">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default MembersAndRolesPage;