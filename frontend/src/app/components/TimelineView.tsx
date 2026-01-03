import { Calendar, MapPin, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface TimelineActivity {
  id: string;
  name: string;
  time: string;
  duration: number;
  location: string;
  category: string;
}

interface TimelineDay {
  date: string;
  city: string;
  activities: TimelineActivity[];
}

interface TimelineViewProps {
  timeline: TimelineDay[];
}

export function TimelineView({ timeline }: TimelineViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3>Trip Timeline</h3>
        <Badge className="bg-blue-100 text-blue-700">
          {timeline.length} Days
        </Badge>
      </div>

      <div className="space-y-6">
        {timeline.map((day, dayIndex) => (
          <Card key={day.date} className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <h4 className="text-blue-900">Day {dayIndex + 1}</h4>
                  </div>
                  <p className="mt-1 text-sm text-blue-700">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <MapPin className="h-4 w-4" />
                  <span>{day.city}</span>
                </div>
              </div>
            </div>

            <div className="p-4">
              {day.activities.length > 0 ? (
                <div className="space-y-3">
                  {day.activities.map((activity, actIndex) => (
                    <div 
                      key={activity.id}
                      className="flex gap-4 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600">
                          {actIndex + 1}
                        </div>
                        {actIndex < day.activities.length - 1 && (
                          <div className="my-1 h-full w-0.5 bg-blue-200" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="mb-1 flex items-start justify-between">
                          <div>
                            <h5 className="text-sm">{activity.name}</h5>
                            <p className="text-xs text-gray-600">{activity.location}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {activity.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{activity.time}</span>
                          </div>
                          <span>•</span>
                          <span>{activity.duration}h duration</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-gray-500">
                  No activities planned for this day yet
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
