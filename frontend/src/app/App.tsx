import { useState } from "react";
import { Search, Plane, MapPin, ListFilter, Plus, ArrowLeft } from "lucide-react";
import { DestinationCard } from "./components/DestinationCard";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { TripPlanner } from "./components/TripPlanner";
import { TripCard, Trip } from "./components/TripCard";
import { Card } from "./components/ui/card";
import { BudgetSummary } from "./components/BudgetSummary";
import { TimelineView } from "./components/TimelineView";
import { Badge } from "./components/ui/badge";
import { toast } from "sonner";

interface Destination {
  id: number;
  name: string;
  country: string;
  image: string;
  price: number;
  rating: number;
  category: string;
  description: string;
}

const destinations: Destination[] = [
  {
    id: 1,
    name: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc2NzM2ODk3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 1299,
    rating: 4.9,
    category: "City",
    description: "Experience the City of Light with iconic landmarks and world-class cuisine.",
  },
  {
    id: 2,
    name: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1640871426525-a19540c45a39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGphcGFuJTIwY2l0eXxlbnwxfHx8fDE3Njc0MDkwNjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 1899,
    rating: 4.8,
    category: "City",
    description: "Discover the perfect blend of ancient traditions and modern innovation.",
  },
  {
    id: 3,
    name: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwYmVhY2h8ZW58MXx8fHwxNzY3NDExNDk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 899,
    rating: 4.7,
    category: "Beach",
    description: "Tropical paradise with stunning beaches, temples, and vibrant culture.",
  },
  {
    id: 4,
    name: "New York",
    country: "USA",
    image: "https://images.unsplash.com/photo-1570304816841-906a17d7b067?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5b3JrJTIwc2t5bGluZXxlbnwxfHx8fDE3NjczNzM2NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 1499,
    rating: 4.8,
    category: "City",
    description: "The city that never sleeps, with endless entertainment and attractions.",
  },
  {
    id: 5,
    name: "Santorini",
    country: "Greece",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW50b3JpbmklMjBncmVlY2V8ZW58MXx8fHwxNzY3MzIzOTAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 1699,
    rating: 4.9,
    category: "Beach",
    description: "Stunning whitewashed buildings and breathtaking sunsets over the Aegean.",
  },
  {
    id: 6,
    name: "Dubai",
    country: "UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMHNreWxpbmV8ZW58MXx8fHwxNzY3MzAyNTk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 1799,
    rating: 4.7,
    category: "City",
    description: "Experience luxury, innovation, and desert adventures in this modern oasis.",
  },
  {
    id: 7,
    name: "Rome",
    country: "Italy",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21lJTIwY29sb3NzZXVtfGVufDF8fHx8MTc2NzMyODAzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 1399,
    rating: 4.8,
    category: "Cultural",
    description: "Step back in time and explore ancient history and Renaissance art.",
  },
  {
    id: 8,
    name: "Barcelona",
    country: "Spain",
    image: "https://images.unsplash.com/photo-1593368858664-a7fe556ab936?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJjZWxvbmElMjBzcGFpbnxlbnwxfHx8fDE3NjczNzM2NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 1199,
    rating: 4.7,
    category: "City",
    description: "Vibrant culture, stunning architecture, and Mediterranean beaches.",
  },
  {
    id: 9,
    name: "Maldives",
    country: "Maldives",
    image: "https://images.unsplash.com/photo-1682308999971-208126ba75ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHJlc29ydHxlbnwxfHx8fDE3NjczNTU4Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 2499,
    rating: 4.9,
    category: "Beach",
    description: "Ultimate luxury resort experience in crystal-clear waters.",
  },
  {
    id: 10,
    name: "London",
    country: "United Kingdom",
    image: "https://images.unsplash.com/photo-1599676603816-0f92b2d713d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBicmlkZ2V8ZW58MXx8fHwxNzY3MzQ2MDM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 1399,
    rating: 4.6,
    category: "City",
    description: "Rich history, royal heritage, and world-class museums and theaters.",
  },
  {
    id: 11,
    name: "Iceland",
    country: "Iceland",
    image: "https://images.unsplash.com/photo-1610123598147-f632aa18b275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2VsYW5kJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc2NzM0NDM3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 1999,
    rating: 4.8,
    category: "Adventure",
    description: "Witness the Northern Lights, geysers, and dramatic volcanic landscapes.",
  },
  {
    id: 12,
    name: "Amsterdam",
    country: "Netherlands",
    image: "https://images.unsplash.com/photo-1625826560092-fc14d19cd40f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbXN0ZXJkYW0lMjBjYW5hbHxlbnwxfHx8fDE3Njc0MTQzMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 1099,
    rating: 4.7,
    category: "City",
    description: "Charming canals, world-class museums, and a unique cycling culture.",
  },
];

type ViewMode = "home" | "my-trips" | "create-trip" | "trip-details";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [signInOpen, setSignInOpen] = useState(false);

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      dest.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleSaveTrip = (trip: Trip) => {
    setTrips([...trips, trip]);
    setViewMode("my-trips");
    toast.success("Trip created successfully!");
  };

  const handleDeleteTrip = (id: string) => {
    setTrips(trips.filter((t) => t.id !== id));
    toast.success("Trip deleted");
  };

  const handleShareTrip = (id: string) => {
    const trip = trips.find((t) => t.id === id);
    if (trip) {
      const shareUrl = `${window.location.origin}/trip/${id}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Trip link copied to clipboard!");
    }
  };

  const handleViewTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setViewMode("trip-details");
  };

  const getDaysCount = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff + 1;
  };

  const generateTimeline = (trip: any) => {
    if (!trip.startDate || !trip.endDate || trip.destinations.length === 0) return [];
    
    const days = getDaysCount(trip.startDate, trip.endDate);
    const daysPerCity = Math.floor(days / trip.destinations.length);
    const timeline = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(trip.startDate);
      date.setDate(date.getDate() + i);
      
      const cityIndex = Math.floor(i / daysPerCity);
      const city = trip.destinations[cityIndex] || trip.destinations[trip.destinations.length - 1];
      
      const cityActivities = (trip.selectedActivities || [])
        .slice(0, 3)
        .map((a: any, idx: number) => ({
          id: a.id,
          name: a.name,
          time: `${9 + idx * 3}:00 AM`,
          duration: a.duration,
          location: a.location,
          category: a.category,
        }));
      
      timeline.push({
        date: date.toISOString(),
        city,
        activities: cityActivities,
      });
    }
    
    return timeline;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div 
              className="flex cursor-pointer items-center gap-2"
              onClick={() => setViewMode("home")}
            >
              <Plane className="h-8 w-8 text-blue-600" />
              <h1 className="text-blue-600">TravelExplore</h1>
            </div>
            <nav className="hidden items-center gap-6 md:flex">
              <button 
                onClick={() => setViewMode("home")}
                className={`text-sm transition-colors ${
                  viewMode === "home" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Destinations
              </button>
              <button 
                onClick={() => setViewMode("my-trips")}
                className={`text-sm transition-colors ${
                  viewMode === "my-trips" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                }`}
              >
                My Trips
                {trips.length > 0 && (
                  <Badge className="ml-2 bg-blue-600">{trips.length}</Badge>
                )}
              </button>
              <a href="#" className="text-sm text-gray-700 hover:text-blue-600">
                About
              </a>
            </nav>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Hi, {user}</span>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setUser(null);
                    toast.success("Signed out");
                  }}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">Sign In</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sign in to TravelExplore</DialogTitle>
                    <DialogDescription>Enter your email to sign in (demo)</DialogDescription>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const data = new FormData(form);
                      const email = (data.get("email") as string) || "user";
                      const display = email.split("@")[0];
                      setUser(display);
                      setSignInOpen(false);
                      toast.success(`Signed in as ${display}`);
                    }}
                  >
                    <div className="grid gap-2 py-4">
                      <Input name="email" type="email" placeholder="you@example.com" required />
                      <Input name="password" type="password" placeholder="Password" required />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                          Sign In
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      {viewMode === "home" && (
        <>
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="mb-4 text-white">Discover Your Next Adventure</h2>
                <p className="mx-auto mb-8 max-w-2xl text-blue-100">
                  Explore the world's most amazing destinations and create unforgettable memories
                </p>

                {/* Search Bar */}
                <div className="mx-auto max-w-3xl">
                  <div className="flex gap-2 rounded-xl bg-white p-2 shadow-xl">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search destinations..."
                        className="border-0 pl-10 focus-visible:ring-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                    <p className="mb-1 text-3xl text-white">500+</p>
                    <p className="text-sm text-blue-100">Destinations</p>
                  </div>
                  <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                    <p className="mb-1 text-3xl text-white">{trips.length}</p>
                    <p className="text-sm text-blue-100">Your Trips</p>
                  </div>
                  <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                    <p className="mb-1 text-3xl text-white">4.8</p>
                    <p className="text-sm text-blue-100">Average Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Destinations Section */}
          <section className="py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="mb-2">Popular Destinations</h2>
                  <p className="text-gray-600">Explore our handpicked travel destinations</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <ListFilter className="h-5 w-5 text-gray-500" />
                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="city">City</TabsTrigger>
                      <TabsTrigger value="beach">Beach</TabsTrigger>
                      <TabsTrigger value="cultural">Cultural</TabsTrigger>
                      <TabsTrigger value="adventure">Adventure</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {filteredDestinations.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredDestinations.map((destination) => (
                    <DestinationCard key={destination.id} {...destination} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-gray-900">No destinations found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
              )}

              {/* CTA Section */}
              <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-12 text-center text-white">
                <h2 className="mb-4 text-white">Ready to Plan Your Trip?</h2>
                <p className="mx-auto mb-6 max-w-2xl text-blue-100">
                  Create personalized multi-city itineraries with automatic budget estimates and timeline visualization
                </p>
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => setViewMode("create-trip")}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Start Planning
                </Button>
              </div>
            </div>
          </section>
        </>
      )}

      {viewMode === "my-trips" && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="mb-2">My Trips</h2>
                <p className="text-gray-600">Manage and view your planned adventures</p>
              </div>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setViewMode("create-trip")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Trip
              </Button>
            </div>

            {trips.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onView={handleViewTrip}
                    onDelete={handleDeleteTrip}
                    onShare={handleShareTrip}
                  />
                ))}
              </div>
            ) : (
              <Card className="py-20 text-center">
                <Plane className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                <h3 className="mb-2 text-gray-900">No trips yet</h3>
                <p className="mb-6 text-gray-600">
                  Start planning your next adventure with our intelligent trip planner
                </p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setViewMode("create-trip")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Trip
                </Button>
              </Card>
            )}
          </div>
        </section>
      )}

      {viewMode === "create-trip" && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <TripPlanner 
              onSave={handleSaveTrip}
              onCancel={() => setViewMode("my-trips")}
            />
          </div>
        </section>
      )}

      {viewMode === "trip-details" && selectedTrip && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Button
              variant="outline"
              className="mb-6"
              onClick={() => setViewMode("my-trips")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Trips
            </Button>

            {/* Trip Header */}
            <Card className="mb-6 overflow-hidden">
              <div className="relative h-64">
                <img
                  src={selectedTrip.coverImage}
                  alt={selectedTrip.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h1 className="mb-2 text-white">{selectedTrip.name}</h1>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {selectedTrip.destinations.join(" → ")}
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Duration</p>
                    <p>
                      {getDaysCount(selectedTrip.startDate, selectedTrip.endDate)} days
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Start Date</p>
                    <p>{new Date(selectedTrip.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Travelers</p>
                    <p>{selectedTrip.travelers}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Activities</p>
                    <p>{selectedTrip.activities}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Budget and Timeline */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <BudgetSummary 
                  breakdown={(selectedTrip as any).budget}
                  travelers={selectedTrip.travelers}
                />
              </div>
              <div>
                <TimelineView timeline={generateTimeline(selectedTrip)} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Plane className="h-6 w-6 text-blue-600" />
                <span className="text-blue-600">TravelExplore</span>
              </div>
              <p className="text-sm text-gray-600">
                Your trusted partner for unforgettable travel experiences around the world.
              </p>
            </div>
            
            <div>
              <h4 className="mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600">Press</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4">Destinations</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Europe</a></li>
                <li><a href="#" className="hover:text-blue-600">Asia</a></li>
                <li><a href="#" className="hover:text-blue-600">Americas</a></li>
                <li><a href="#" className="hover:text-blue-600">Africa</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2026 TravelExplore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
