import { Heart, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface DestinationCardProps {
  id: number;
  name: string;
  country: string;
  image: string;
  price: number;
  rating: number;
  category: string;
  description: string;
}

export function DestinationCard({
  name,
  country,
  image,
  price,
  rating,
  category,
  description,
}: DestinationCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-3 top-3 bg-white/90 backdrop-blur-sm hover:bg-white"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart
            className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"}`}
          />
        </Button>
        <Badge className="absolute bottom-3 left-3 bg-white/90 text-gray-900 backdrop-blur-sm">
          {category}
        </Badge>
      </div>
      
      <div className="p-5">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="mb-1">{name}</h3>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{country}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{rating}</span>
          </div>
        </div>
        
        <p className="mb-4 text-sm text-gray-600">{description}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500">From</span>
            <p className="text-blue-600">${price}</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
