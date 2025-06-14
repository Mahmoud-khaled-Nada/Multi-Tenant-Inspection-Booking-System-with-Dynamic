
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { bookingsApi, teamsApi, slotsApi } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Calendar as CalendarIcon, Clock, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Bookings = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');

  const { data: teams } = useQuery({
    queryKey: ['teams', user?.tenantId],
    queryFn: () => teamsApi.getAll(user?.tenantId || ''),
    enabled: !!user?.tenantId,
  });

  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['bookings', user?.tenantId],
    queryFn: () => bookingsApi.getAll(user?.tenantId || ''),
    enabled: !!user?.tenantId,
  });

  const { data: timeSlots, isLoading: isLoadingSlots } = useQuery({
    queryKey: ['slots', selectedTeamId, selectedDate],
    queryFn: () => {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      return slotsApi.generateSlots(selectedTeamId, dateStr, dateStr);
    },
    enabled: !!selectedTeamId && !!selectedDate,
  });

  const selectedTeam = teams?.find(team => team.id === selectedTeamId);
  const todayBookings = bookings?.filter(booking => 
    booking.date === format(selectedDate, 'yyyy-MM-dd')
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600 mt-2">Manage inspection bookings and view available time slots</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          New Booking
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Calendar */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <span>Select Date</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="w-full border-0 p-0"
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
                head_cell: "text-gray-500 rounded-md w-8 font-normal text-xs text-center",
                row: "flex w-full mt-1",
                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 h-8 w-8",
                day: "h-8 w-8 p-0 font-normal rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors",
                day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                day_today: "bg-blue-50 text-blue-600 font-semibold",
                day_outside: "text-gray-400 opacity-50",
                day_disabled: "text-gray-300 opacity-50",
                day_hidden: "invisible",
              }}
            />
          </CardContent>
        </Card>

        {/* Team Selection & Time Slots */}
        <div className="lg:col-span-2 space-y-6">
          {/* Team Selection */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
            <CardHeader>
              <CardTitle>Select Team</CardTitle>
              <CardDescription>Choose a team to view available time slots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {teams?.map((team) => (
                  <Button
                    key={team.id}
                    variant={selectedTeamId === team.id ? "default" : "outline"}
                    className={`${
                      selectedTeamId === team.id 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                        : ''
                    }`}
                    onClick={() => setSelectedTeamId(team.id)}
                  >
                    {team.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time Slots */}
          {selectedTeam && (
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Available Time Slots</span>
                </CardTitle>
                <CardDescription>
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')} - {selectedTeam.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingSlots ? (
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : timeSlots && timeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot, index) => (
                      <Button
                        key={index}
                        variant={slot.available ? "outline" : "secondary"}
                        disabled={!slot.available}
                        className={`h-12 flex flex-col items-center justify-center text-xs ${
                          slot.available 
                            ? 'hover:bg-blue-50 border-blue-200' 
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <span className="font-medium">
                          {format(parseISO(slot.startTime), 'HH:mm')}
                        </span>
                        <span className="text-gray-500">
                          {slot.available ? 'Available' : 'Booked'}
                        </span>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No time slots available for this date</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Today's Bookings */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>Today's Bookings</span>
            </CardTitle>
            <CardDescription>
              {format(selectedDate, 'MMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingBookings ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : todayBookings && todayBookings.length > 0 ? (
              <div className="space-y-3">
                {todayBookings.map((booking) => {
                  const team = teams?.find(t => t.id === booking.teamId);
                  return (
                    <div key={booking.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          {format(parseISO(booking.startTime), 'HH:mm')} - {format(parseISO(booking.endTime), 'HH:mm')}
                        </span>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{team?.name}</span>
                        </div>
                        {booking.notes && (
                          <p className="text-gray-500">{booking.notes}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No bookings for this date</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Bookings;
