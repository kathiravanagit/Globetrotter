import { Calendar, MapPin, Users, DollarSign, Share2, Trash2, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

export interface Trip {
  id: string;
  name: string;
  destinations: string[];
  startDate: string;
  endDate: string;
  travelers: number;
  estimatedBudget: number;
  activities: number;
  coverImage: string;
  status: "planning" | "upcoming" | "completed";
}

interface TripCardProps {
  trip: Trip;
  onView: (trip: Trip) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}

export function TripCard({ trip, onView, onDelete, onShare }: TripCardProps) {
  const getDaysCount = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff + 1;
  };

  const getStatusColor = () => {
    switch (trip.status) {
      case "planning": return "bg-blue-100 text-blue-700";
      case "upcoming": return "bg-green-100 text-green-700";
      case "completed": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className={`absolute right-3 top-3 ${getStatusColor()}`}>
          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
        </Badge>
      </div>
      
      <div className="p-5">
        <h3 className="mb-3">{trip.name}</h3>
        
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{trip.destinations.join(" → ")}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{getDaysCount()} days • {new Date(trip.startDate).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{trip.travelers}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>${trip.estimatedBudget.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => onView(trip)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onShare(trip.id)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(trip.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
