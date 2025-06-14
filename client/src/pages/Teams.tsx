
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { teamsApi } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Users, Plus, User, Calendar, Clock, Settings } from 'lucide-react';

const Teams = () => {
  const { user } = useAuth();
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [isManageTeamOpen, setIsManageTeamOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  
  const { data: teams, isLoading, error } = useQuery({
    queryKey: ['teams', user?.tenantId],
    queryFn: () => teamsApi.getAll(user?.tenantId || ''),
    enabled: !!user?.tenantId,
  });

  const selectedTeam = teams?.find(team => team.id === selectedTeamId);

  const handleAddTeam = () => {
    // This would normally call the API to create a new team
    console.log('Adding team:', { name: newTeamName, description: newTeamDescription });
    setIsAddTeamOpen(false);
    setNewTeamName('');
    setNewTeamDescription('');
  };

  const handleManageTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    setIsManageTeamOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg">Error loading teams</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600 mt-2">Manage your inspection teams and their members</p>
        </div>
        <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Team</DialogTitle>
              <DialogDescription>
                Create a new inspection team and configure their settings.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g., Building Inspectors"
                />
              </div>
              <div>
                <Label htmlFor="teamDescription">Description</Label>
                <Textarea
                  id="teamDescription"
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  placeholder="Describe the team's role and expertise..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddTeamOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTeam}>
                  Create Team
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams?.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm border-gray-200/50">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                  <CardDescription>{team.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Team Members</span>
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{team.members.length}</span>
                </Badge>
              </div>
              
              <div className="space-y-2">
                {team.members.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex items-center space-x-2 text-sm">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-gray-600" />
                    </div>
                    <span className="text-gray-700">{member.name}</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {member.role}
                    </Badge>
                  </div>
                ))}
                {team.members.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{team.members.length - 3} more members
                  </div>
                )}
              </div>
              
              <div className="pt-2 border-t space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full text-sm"
                  onClick={() => handleManageTeam(team.id)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Team
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Schedule
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    Book
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Manage Team Dialog */}
      <Dialog open={isManageTeamOpen} onOpenChange={setIsManageTeamOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedTeam?.name} - Weekly Schedule</DialogTitle>
            <DialogDescription>
              Configure recurring weekly availability for this team
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Weekly Schedule */}
            <div className="space-y-4">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium w-20">{day}</span>
                    {index === 0 ? (
                      <Badge variant="secondary">Unavailable</Badge>
                    ) : (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>09:00 AM - 5:00 PM</span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsManageTeamOpen(false)}>
                Close
              </Button>
              <div className="space-x-2">
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Booking
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {teams?.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first inspection team.</p>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={() => setIsAddTeamOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </Button>
        </div>
      )}
    </div>
  );
};

export default Teams;
