
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { teamsApi, bookingsApi } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Users, Calendar, Clock, User } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: teams } = useQuery({
    queryKey: ['teams', user?.tenantId],
    queryFn: () => teamsApi.getAll(user?.tenantId || ''),
    enabled: !!user?.tenantId,
  });

  const { data: bookings } = useQuery({
    queryKey: ['bookings', user?.tenantId],
    queryFn: () => bookingsApi.getAll(user?.tenantId || ''),
    enabled: !!user?.tenantId,
  });

  const todayBookings = bookings?.filter(booking => 
    isToday(parseISO(booking.date))
  ) || [];

  const tomorrowBookings = bookings?.filter(booking => 
    isTomorrow(parseISO(booking.date))
  ) || [];

  const totalMembers = teams?.reduce((acc, team) => acc + team.members.length, 0) || 0;

  const stats = [
    {
      title: 'Active Teams',
      value: teams?.length || 0,
      icon: Users,
      description: 'Inspection teams',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Team Members',
      value: totalMembers,
      icon: User,
      description: 'Total inspectors',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: "Today's Bookings",
      value: todayBookings.length,
      icon: Calendar,
      description: 'Scheduled inspections',
      color: 'from-purple-500 to-violet-500'
    },
    {
      title: 'Total Bookings',
      value: bookings?.length || 0,
      icon: Clock,
      description: 'All time bookings',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your inspection booking system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-white/80 backdrop-blur-sm border-gray-200/50 hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Schedule */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Today's Schedule</span>
            </CardTitle>
            <CardDescription>
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayBookings.length > 0 ? (
              <div className="space-y-3">
                {todayBookings.map((booking) => {
                  const team = teams?.find(t => t.id === booking.teamId);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-sm">
                            {format(parseISO(booking.startTime), 'HH:mm')} - {format(parseISO(booking.endTime), 'HH:mm')}
                          </div>
                          <div className="text-xs text-gray-600">{team?.name}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {booking.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No inspections scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tomorrow's Preview */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Tomorrow's Preview</span>
            </CardTitle>
            <CardDescription>
              {format(new Date(Date.now() + 24 * 60 * 60 * 1000), 'EEEE, MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tomorrowBookings.length > 0 ? (
              <div className="space-y-3">
                {tomorrowBookings.map((booking) => {
                  const team = teams?.find(t => t.id === booking.teamId);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-sm">
                            {format(parseISO(booking.startTime), 'HH:mm')} - {format(parseISO(booking.endTime), 'HH:mm')}
                          </div>
                          <div className="text-xs text-gray-600">{team?.name}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {booking.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No inspections scheduled for tomorrow</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Schedule Inspection</div>
                  <div className="text-xs text-gray-600">Book a new time slot</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Manage Teams</div>
                  <div className="text-xs text-gray-600">Add or edit team settings</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Set Availability</div>
                  <div className="text-xs text-gray-600">Update team schedules</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
