import { useState } from "react";
import { Plus, X, Calendar, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ActivityCard, Activity } from "./ActivityCard";
import { BudgetSummary } from "./BudgetSummary";
import { TimelineView } from "./TimelineView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Destination {
  name: string;
  country: string;
  image: string;
}

const availableDestinations: Destination[] = [
  { name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400" },
  { name: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1640871426525-a19540c45a39?w=400" },
  { name: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=400" },
  { name: "New York", country: "USA", image: "https://images.unsplash.com/photo-1570304816841-906a17d7b067?w=400" },
  { name: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400" },
  { name: "Dubai", country: "UAE", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400" },
  { name: "Rome", country: "Italy", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400" },
  { name: "Barcelona", country: "Spain", image: "https://images.unsplash.com/photo-1593368858664-a7fe556ab936?w=400" },
];

const activitiesByCity: Record<string, Activity[]> = {
  Paris: [
    { id: "p1", name: "Eiffel Tower Tour", description: "Visit the iconic Eiffel Tower with skip-the-line access", duration: 3, price: 45, category: "Landmark", image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400", location: "Champ de Mars" },
    { id: "p2", name: "Louvre Museum", description: "Explore world-famous art at the Louvre", duration: 4, price: 35, category: "Museum", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400", location: "1st arrondissement" },
    { id: "p3", name: "Seine River Cruise", description: "Romantic evening cruise along the Seine", duration: 2, price: 28, category: "Experience", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400", location: "River Seine" },
  ],
  Tokyo: [
    { id: "t1", name: "Senso-ji Temple", description: "Visit Tokyo's oldest and most famous temple", duration: 2, price: 0, category: "Cultural", image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400", location: "Asakusa" },
    { id: "t2", name: "Tokyo Skytree", description: "Panoramic views from Japan's tallest structure", duration: 2, price: 25, category: "Landmark", image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400", location: "Sumida" },
    { id: "t3", name: "Shibuya Crossing", description: "Experience the world's busiest intersection", duration: 1, price: 0, category: "Experience", image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400", location: "Shibuya" },
  ],
  Bali: [
    { id: "b1", name: "Uluwatu Temple", description: "Clifftop temple with stunning ocean views", duration: 3, price: 15, category: "Cultural", image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400", location: "Uluwatu" },
    { id: "b2", name: "Rice Terrace Trek", description: "Guided walk through Tegalalang rice terraces", duration: 4, price: 35, category: "Nature", image: "https://images.unsplash.com/photo-1532186651327-6ac23687d189?w=400", location: "Tegalalang" },
    { id: "b3", name: "Beach Day at Seminyak", description: "Relax at pristine beaches with water sports", duration: 5, price: 20, category: "Beach", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400", location: "Seminyak" },
  ],
  "New York": [
    { id: "ny1", name: "Statue of Liberty", description: "Ferry ride and tour of Liberty Island", duration: 4, price: 55, category: "Landmark", image: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=400", location: "Liberty Island" },
    { id: "ny2", name: "Central Park Walk", description: "Guided tour of NYC's famous urban park", duration: 3, price: 25, category: "Nature", image: "https://images.unsplash.com/photo-1553969420-fb915228af51?w=400", location: "Central Park" },
    { id: "ny3", name: "Broadway Show", description: "Evening musical or play performance", duration: 3, price: 120, category: "Entertainment", image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400", location: "Theater District" },
  ],
};

interface TripPlannerProps {
  onSave: (trip: any) => void;
  onCancel: () => void;
}

export function TripPlanner({ onSave, onCancel }: TripPlannerProps) {
  const [tripName, setTripName] = useState("");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const handleAddCity = (cityName: string) => {
    if (cityName && !selectedCities.includes(cityName)) {
      setSelectedCities([...selectedCities, cityName]);
    }
  };

  const handleRemoveCity = (cityName: string) => {
    setSelectedCities(selectedCities.filter((c) => c !== cityName));
    // Remove activities from removed city
    setSelectedActivities(
      selectedActivities.filter(
        (a) => !activitiesByCity[cityName]?.some((ca) => ca.id === a.id)
      )
    );
  };

  const handleToggleActivity = (activity: Activity) => {
    const isSelected = selectedActivities.some((a) => a.id === activity.id);
    if (isSelected) {
      setSelectedActivities(selectedActivities.filter((a) => a.id !== activity.id));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const calculateBudget = () => {
    const activitiesCost = selectedActivities.reduce((sum, a) => sum + a.price, 0);
    const days = getDaysCount();
    const flightCost = selectedCities.length * 400 * travelers; // Estimated $400 per flight per person
    const accommodationCost = days * 150 * travelers; // $150 per night per person
    const foodCost = days * 60 * travelers; // $60 per day per person
    
    return {
      flights: flightCost,
      accommodation: accommodationCost,
      activities: activitiesCost * travelers,
      food: foodCost,
      other: 200 * travelers, // Miscellaneous
    };
  };

  const getDaysCount = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff + 1;
  };

  const generateTimeline = () => {
    if (!startDate || !endDate || selectedCities.length === 0) return [];
    
    const days = getDaysCount();
    const daysPerCity = Math.floor(days / selectedCities.length);
    const timeline = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const cityIndex = Math.floor(i / daysPerCity);
      const city = selectedCities[cityIndex] || selectedCities[selectedCities.length - 1];
      
      const cityActivities = selectedActivities
        .filter(a => activitiesByCity[city]?.some(ca => ca.id === a.id))
        .slice(0, 3)
        .map((a, idx) => ({
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

  const handleSave = () => {
    const budget = calculateBudget();
    const totalBudget = Object.values(budget).reduce((sum, val) => sum + val, 0);
    
    const trip = {
      id: Date.now().toString(),
      name: tripName,
      destinations: selectedCities,
      startDate,
      endDate,
      travelers,
      estimatedBudget: totalBudget,
      activities: selectedActivities.length,
      coverImage: availableDestinations.find((d) => d.name === selectedCities[0])?.image || "",
      status: "planning" as const,
      selectedActivities,
      budget,
    };
    
    onSave(trip);
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return tripName && selectedCities.length > 0 && startDate && endDate && travelers > 0;
    }
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Create New Trip</h2>
          <p className="text-gray-600">Plan your perfect multi-city adventure</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSave}
            disabled={!canProceed()}
          >
            Save Trip
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                currentStep >= step
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step}
            </div>
            <div className="flex-1">
              <div
                className={`h-1 rounded ${
                  currentStep > step ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      <Tabs value={currentStep.toString()} onValueChange={(v) => setCurrentStep(Number(v))}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="1">Basic Info</TabsTrigger>
          <TabsTrigger value="2" disabled={!canProceed()}>Activities</TabsTrigger>
          <TabsTrigger value="3" disabled={!canProceed()}>Review</TabsTrigger>
        </TabsList>

        {/* Step 1: Basic Information */}
        <TabsContent value="1" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Trip Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tripName">Trip Name</Label>
                <Input
                  id="tripName"
                  placeholder="e.g., Europe Summer Adventure"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="travelers">Number of Travelers</Label>
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Select Destinations</h3>
            <div className="mb-4">
              <Label>Add City</Label>
              <Select onValueChange={handleAddCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a destination" />
                </SelectTrigger>
                <SelectContent>
                  {availableDestinations
                    .filter((d) => !selectedCities.includes(d.name))
                    .map((dest) => (
                      <SelectItem key={dest.name} value={dest.name}>
                        {dest.name}, {dest.country}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCities.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Cities ({selectedCities.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedCities.map((city, index) => (
                    <div
                      key={city}
                      className="flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2"
                    >
                      <span className="text-sm">
                        {index + 1}. {city}
                      </span>
                      <button
                        onClick={() => handleRemoveCity(city)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <div className="flex justify-end">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setCurrentStep(2)}
              disabled={!canProceed()}
            >
              Next: Select Activities
            </Button>
          </div>
        </TabsContent>

        {/* Step 2: Activities */}
        <TabsContent value="2" className="space-y-6">
          {selectedCities.map((city) => (
            <Card key={city} className="p-6">
              <h3 className="mb-4">{city} Activities</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(activitiesByCity[city] || []).map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    isSelected={selectedActivities.some((a) => a.id === activity.id)}
                    onToggle={handleToggleActivity}
                  />
                ))}
              </div>
            </Card>
          ))}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Back
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setCurrentStep(3)}
            >
              Next: Review & Budget
            </Button>
          </div>
        </TabsContent>

        {/* Step 3: Review */}
        <TabsContent value="3" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-4">Trip Summary</h3>
                <div className="space-y-3">
                  <div>
                    <Label>Trip Name</Label>
                    <p>{tripName}</p>
                  </div>
                  <div>
                    <Label>Destinations</Label>
                    <p>{selectedCities.join(" → ")}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Duration</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <p>{getDaysCount()} days</p>
                      </div>
                    </div>
                    <div>
                      <Label>Travelers</Label>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <p>{travelers}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Activities Selected</Label>
                    <p>{selectedActivities.length} activities</p>
                  </div>
                </div>
              </Card>

              <BudgetSummary breakdown={calculateBudget()} travelers={travelers} />
            </div>

            <div>
              <TimelineView timeline={generateTimeline()} />
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              Back
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
