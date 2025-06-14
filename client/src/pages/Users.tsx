/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { teamsApi } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { User, Plus, Mail, Shield, UsersIcon, Search, Filter, Calendar, Settings } from 'lucide-react';
import { useCreateUserMutation, useUsersAnalysisQuery } from '@/services/users-management';
import { toast } from 'sonner';
import { Loading } from '@/components/Loading';
import { useAssignTenantsMutation, useTeamsQuery } from '@/services/teams';
import { useCreateBookingMutation } from '@/services/booking';

const Users = () => {
  const { user } = useAuth();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isEditTeamsOpen, setIsEditTeamsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newTenantName, setNewTenantName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'manager' | 'inspector'>('inspector');
  const [editAction, setEditAction] = useState('');
  const createUser = useCreateUserMutation()
  const usersAnalysis = useUsersAnalysisQuery()
  const assignTenants = useAssignTenantsMutation()
  const createBooking = useCreateBookingMutation()

  //

  // New Booking form state
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bookingTeam, setBookingTeam] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');

  // Get all users from teams

  const team = useTeamsQuery()

  if (team.isLoading)
    return <Loading />

  // Get all users from teams

  if (usersAnalysis.isLoading)
    return <Loading />



  const allUsers = usersAnalysis.data.users || [];
  const uniqueUsers = allUsers.filter((user, index, self) =>
    index === self.findIndex(u => u.id === user.id)
  );

  // Filter users based on search and role
  const filteredUsers = uniqueUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    console.log('Adding user:', { email: newUserEmail, name: newUserName, role: newUserRole });
    createUser.mutate({ email: newUserEmail, name: newUserName, role: newUserRole, tenant_name: newTenantName, password: newPassword }, {
      onSuccess: () => {
        toast.success('User added successfully');
      },
      onError: (error) => {
        console.error('Error adding user:', error);
        toast.error('Error adding user');
      },
    });

    setIsAddUserOpen(false);
    setNewUserEmail('');
    setNewUserName('');
    setNewPassword('');
    setNewTenantName('');
    setNewUserRole('inspector');

  };

  const handleNewBooking = () => {
    console.log('Creating new booking:', {
      date: bookingDate,
      time: bookingTime,
      team: bookingTeam,
      notes: bookingNotes
    });
    createBooking.mutate({
      team_id: bookingTeam,
      date: bookingDate,
      start_time: bookingTime,
      end_time: endTime,
    }, {
      onSuccess: () => {
        toast.success('Booking created successfully');
        setIsNewBookingOpen(false);
        setBookingDate('');
        setBookingTime('');
        setBookingTeam('');
        setBookingNotes('');
      },
       onError: (error: any) => {
        toast.error(error.message || 'Error assigning team');
      },
    })
  };




  const handleAssignTeam = (teamId: string, tenantId: string) => {
    console.log({ teamId, tenantId })
    assignTenants.mutate({ teamId, tenantId }, {
      onSuccess: () => {
        toast.success('Team assigned successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error assigning team');
      },
    });
  };

  const handleEditTeams = (userId: string, action: 'teams' | 'profile') => {
    if (action === 'profile') {
      setEditAction('profile');
      setSelectedUserId(userId);
      setIsEditTeamsOpen(true);
    }
  };

  const handleEditUser = (userId: string, action: 'teams' | 'profile') => {
    if (action === 'teams') {
      setEditAction('teams');
      setSelectedUserId(userId);
      setIsEditTeamsOpen(true);
    }
    // Add other modals like `setIsEditProfileOpen(true)` if needed
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'inspector':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserTeams = (userId: string) => {
    return team.data?.filter(team => team.members.some(member => member.id === userId)) || [];
  };

  const selectedUser = uniqueUsers.find(u => u.id === selectedUserId);
  const selectedUserTeams = selectedUser ? getUserTeams(selectedUser.id) : [];


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">Manage user accounts and their permissions</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isNewBookingOpen} onOpenChange={setIsNewBookingOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                <Calendar className="w-4 h-4 mr-2" />
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
                  <Label htmlFor="bookingTime">End Time</Label>
                  <Input
                    id="bookingTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="bookingTeam">Team</Label>
                  <Select value={bookingTeam} onValueChange={setBookingTeam}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {team?.data?.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bookingNotes">Notes</Label>
                  <Textarea
                    id="bookingNotes"
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Additional booking details..."
                  />
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

          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account and assign their role.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tenant_name">Tenant Name</Label>
                  <Input
                    id="tenant_name"
                    value={newTenantName}
                    onChange={(e) => setNewTenantName(e.target.value)}
                    placeholder="tenant 123"
                  />
                </div>
                <div>
                  <Label htmlFor="userEmail">Email</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="user@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="userName">Full Name</Label>
                  <Input
                    id="userName"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="userRole">Role</Label>
                  <Select value={newUserRole} onValueChange={(value: 'admin' | 'manager' | 'inspector') => setNewUserRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inspector">Inspector</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>
                    Create User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{!usersAnalysis.isLoading && usersAnalysis.data.users_count}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {!usersAnalysis.isLoading && usersAnalysis.data.admin_count}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {!usersAnalysis.isLoading && usersAnalysis.data.manager_count}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inspectors</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {!usersAnalysis.isLoading && usersAnalysis.data.inspector_count}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Users Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-lg">User List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="inspector">Inspector</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Users Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Teams</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const userTeams = getUserTeams(user.id);
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {userTeams.slice(0, 2).map((team) => (
                          <Badge key={team.id} variant="outline" className="text-xs">
                            {team.name}
                          </Badge>
                        ))}
                        {userTeams.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{userTeams.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user.id, 'teams')}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTeams(user.id, 'profile')}
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Teams
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 || usersAnalysis.isLoading && (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Teams Dialog */}
      <Dialog open={isEditTeamsOpen} onOpenChange={setIsEditTeamsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Teams - {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Manage team assignments for this user
            </DialogDescription>
          </DialogHeader>


          {
            editAction === "teams" ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bookingDate">User Name</Label>
                  <Input
                    disabled={true}
                    value={selectedUser?.name || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="bookingTeam">Team</Label>
                  <Select value={bookingTeam} onValueChange={setBookingTeam}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {team.data?.map((team) => (
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
                  <Button onClick={() => handleAssignTeam(bookingTeam, selectedUser?.tenant_id)}>
                    Add
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>Current Teams</Label>
                  <div className="mt-2 space-y-2">
                    {selectedUserTeams.length > 0 ? (
                      selectedUserTeams.map((team) => (
                        <div key={team.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{team.name}</div>
                            <div className="text-sm text-gray-500">{team.description}</div>
                          </div>
                          <Button variant="outline" size="sm">
                            Remove
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">User is not assigned to any teams</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Available Teams</Label>
                  <div className="mt-2 space-y-2">
                    {team?.data?.filter(team => !selectedUserTeams.some(userTeam => userTeam.id === team.id)).map((team) => (
                      <div key={team.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <div>
                          <div className="font-medium">{team.name}</div>
                          <div className="text-sm text-gray-500">{team.description}</div>
                        </div>
                        <Button variant="outline" size="sm">
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditTeamsOpen(false)}>
                    Close
                  </Button>
                  <Button>
                    Save Changes
                  </Button>
                </div>
              </div>
            )
          }
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
