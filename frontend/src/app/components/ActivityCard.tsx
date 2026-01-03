import { Clock, DollarSign, Users, Plus, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: number; // in hours
  price: number;
  category: string;
  image: string;
  location: string;
}

interface ActivityCardProps {
  activity: Activity;
  isSelected: boolean;
  onToggle: (activity: Activity) => void;
}

export function ActivityCard({ activity, isSelected, onToggle }: ActivityCardProps) {
  return (
    <div className={`group overflow-hidden rounded-lg border bg-white transition-all ${
      isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-blue-300"
    }`}>
      <div className="relative h-40 overflow-hidden">
        <img
          src={activity.image}
          alt={activity.name}
          className="h-full w-full object-cover"
        />
        <Badge className="absolute left-3 top-3 bg-white/90 text-gray-900 backdrop-blur-sm">
          {activity.category}
        </Badge>
      </div>
      
      <div className="p-4">
        <h4 className="mb-2">{activity.name}</h4>
        <p className="mb-3 text-sm text-gray-600 line-clamp-2">{activity.description}</p>
        
        <div className="mb-3 flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{activity.duration}h</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>${activity.price}</span>
          </div>
        </div>
        
        <Button
          className={`w-full ${
            isSelected 
              ? "bg-blue-600 hover:bg-blue-700" 
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
          }`}
          onClick={() => onToggle(activity)}
        >
          {isSelected ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Added
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add to Trip
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
