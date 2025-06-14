
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { teamsApi } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Clock, Calendar as CalendarIcon, Plus, Settings, Edit, Users, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const Availability = () => {
  const { user } = useAuth();
  const [isEditAvailabilityOpen, setIsEditAvailabilityOpen] = useState(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isViewCalendarOpen, setIsViewCalendarOpen] = useState(false);
  const [isEditTeamsOpen, setIsEditTeamsOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingTeam, setBookingTeam] = useState('');
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');

  const { data: teams } = useQuery({
    queryKey: ['teams', user?.tenantId],
    queryFn: () => teamsApi.getAll(user?.tenantId || ''),
    enabled: !!user?.tenantId,
  });

  const weekDays = [
    { name: 'Sunday', index: 0, available: false },
    { name: 'Monday', index: 1, available: true },
    { name: 'Tuesday', index: 2, available: true },
    { name: 'Wednesday', index: 3, available: true },
    { name: 'Thursday', index: 4, available: true },
    { name: 'Friday', index: 5, available: true },
    { name: 'Saturday', index: 6, available: false },
  ];

  const handleEditAvailability = (teamId: string, day: string) => {
    setSelectedTeamId(teamId);
    setSelectedDay(day);
    setIsEditAvailabilityOpen(true);
  };

  const handleSaveAvailability = () => {
    console.log('Saving availability:', { 
      teamId: selectedTeamId, 
      day: selectedDay, 
      startTime, 
      endTime 
    });
    setIsEditAvailabilityOpen(false);
  };

  const handleNewBooking = () => {
    console.log('Creating new booking:', { 
      date: bookingDate, 
      time: bookingTime, 
      team: bookingTeam 
    });
    setIsNewBookingOpen(false);
    setBookingDate('');
    setBookingTime('');
    setBookingTeam('');
  };

  const handleViewCalendar = () => {
    setIsViewCalendarOpen(true);
  };

  const handleEditTeam = (team: any) => {
    setEditingTeam(team);
    setTeamName(team.name);
    setTeamDescription(team.description);
    setIsEditTeamsOpen(true);
  };

  const handleSaveTeam = () => {
    console.log('Saving team:', { 
      id: editingTeam?.id, 
      name: teamName, 
      description: teamDescription 
    });
    setIsEditTeamsOpen(false);
    setEditingTeam(null);
    setTeamName('');
    setTeamDescription('');
  };

  const handleDeleteTeam = (teamId: string) => {
    console.log('Deleting team:', teamId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Availability</h1>
          <p className="text-gray-600 mt-2">Configure recurring weekly availability for your teams</p>
        </div>
        <Dialog open={isNewBookingOpen} onOpenChange={setIsNewBookingOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Booking</DialogTitle>
              <DialogDescription>
                Schedule a new inspection booking for a team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bookingDate">Date</Label>
                <Input
                  id="bookingDate"
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bookingTime">Time</Label>
                <Input
                  id="bookingTime"
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bookingTeam">Team</Label>
                <Select value={bookingTeam} onValueChange={setBookingTeam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams?.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewBookingOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNewBooking}>
                  Create Booking
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {teams?.map((team) => (
        <Card key={team.id} className="bg-white/80 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span>{team.name} - Weekly Schedule</span>
            </CardTitle>
            <CardDescription>
              Configure recurring weekly availability for this team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weekDays.map((day) => (
                <div key={day.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium w-20">{day.name}</span>
                    {day.available ? (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>09:00 AM - 5:00 PM</span>
                      </div>
                    ) : (
                      <Badge variant="secondary">Unavailable</Badge>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditAvailability(team.id, day.name)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6 pt-4 border-t">
              <Button variant="outline" onClick={handleViewCalendar}>
                <CalendarIcon className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => handleEditTeam(team)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Team
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  onClick={() => setIsNewBookingOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Booking
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* View Calendar Dialog */}
      <Dialog open={isViewCalendarOpen} onOpenChange={setIsViewCalendarOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <span>Team Calendar View</span>
            </DialogTitle>
            <DialogDescription>
              View team availability and bookings for {format(calendarDate, 'MMMM yyyy')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={(date) => date && setCalendarDate(date)}
                className="w-full border rounded-lg p-3"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4 w-full",
                  caption: "flex justify-center pt-1 relative items-center mb-4",
                  caption_label: "text-sm font-medium text-gray-900",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-gray-100 rounded-md transition-colors",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex w-full",
                  head_cell: "text-gray-500 rounded-md w-9 font-normal text-xs text-center",
                  row: "flex w-full mt-1",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 h-9 w-9",
                  day: "h-9 w-9 p-0 font-normal rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors",
                  day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                  day_today: "bg-blue-50 text-blue-600 font-semibold",
                  day_outside: "text-gray-400 opacity-50",
                  day_disabled: "text-gray-300 opacity-50",
                  day_hidden: "invisible",
                }}
              />
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Selected Date: {format(calendarDate, 'EEEE, MMMM d, yyyy')}</h4>
              <div className="space-y-2">
                {teams?.map((team) => (
                  <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Users className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-medium">{team.name}</span>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      Available 9:00 AM - 5:00 PM
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsViewCalendarOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Teams Dialog */}
      <Dialog open={isEditTeamsOpen} onOpenChange={setIsEditTeamsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <span>Edit Team - {editingTeam?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Manage team details and members
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Team Details Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Team Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter team name"
                  />
                </div>
                <div>
                  <Label htmlFor="teamDescription">Description</Label>
                  <Textarea
                    id="teamDescription"
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                    placeholder="Enter team description"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Team Members Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Team Members</h4>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Member
                </Button>
              </div>
              
              <div className="space-y-2">
                {editingTeam?.members?.map((member: any) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <span className="font-medium">{member.name}</span>
                        <div className="text-sm text-gray-500">{member.role}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteTeam(editingTeam?.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Team
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsEditTeamsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTeam}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Availability Dialog */}
      <Dialog open={isEditAvailabilityOpen} onOpenChange={setIsEditAvailabilityOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Availability - {selectedDay}</DialogTitle>
            <DialogDescription>
              Configure the working hours for this day
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditAvailabilityOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAvailability}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Availability;
