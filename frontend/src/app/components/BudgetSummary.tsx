import { DollarSign, Plane, Hotel, UtensilsCrossed, Ticket } from "lucide-react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";

interface BudgetBreakdown {
  flights: number;
  accommodation: number;
  activities: number;
  food: number;
  other: number;
}

interface BudgetSummaryProps {
  breakdown: BudgetBreakdown;
  travelers: number;
}

export function BudgetSummary({ breakdown, travelers }: BudgetSummaryProps) {
  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
  const perPerson = total / travelers;

  const categories = [
    { 
      name: "Flights", 
      amount: breakdown.flights, 
      icon: Plane, 
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    { 
      name: "Accommodation", 
      amount: breakdown.accommodation, 
      icon: Hotel, 
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    { 
      name: "Activities", 
      amount: breakdown.activities, 
      icon: Ticket, 
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    { 
      name: "Food & Dining", 
      amount: breakdown.food, 
      icon: UtensilsCrossed, 
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    { 
      name: "Other", 
      amount: breakdown.other, 
      icon: DollarSign, 
      color: "text-gray-600",
      bgColor: "bg-gray-100"
    },
  ];

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3>Budget Summary</h3>
        <div className="text-right">
          <div className="text-2xl text-blue-600">${total.toLocaleString()}</div>
          <div className="text-sm text-gray-600">${perPerson.toLocaleString()} per person</div>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((category) => {
          const percentage = total > 0 ? (category.amount / total) * 100 : 0;
          const Icon = category.icon;
          
          return (
            <div key={category.name}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`rounded-lg ${category.bgColor} p-2`}>
                    <Icon className={`h-4 w-4 ${category.color}`} />
                  </div>
                  <span className="text-sm">{category.name}</span>
                </div>
                <span className="text-sm">${category.amount.toLocaleString()}</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-gray-700">
          💡 Tip: Budget is automatically calculated based on selected destinations, 
          activities, and number of travelers.
        </p>
      </div>
    </Card>
  );
}
