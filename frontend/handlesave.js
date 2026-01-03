const handleSave = async () => {
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
    status: "planning",
    selectedActivities,
    budget,
  };

  // Try to POST to backend API; include JWT if available
  try {
    const apiUrl = import.meta.env.VITE_API_URL || "";
    const token = localStorage.getItem("token");

    const res = await fetch(`${apiUrl || ""}/api/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        name: trip.name,
        start_date: trip.startDate,
        end_date: trip.endDate,
        cover_photo: trip.coverImage,
        // backend expects more fields only if needed; add them if available
      }),
    });

    if (res.ok) {
      const saved = await res.json();
      onSave({ ...trip, id: saved.id });
      return;
    } else {
      // if unauthorized or other error, fall back to local save
      console.warn("Backend save failed, falling back to local save", res.status);
    }
  } catch (err) {
    console.warn("Could not reach backend, falling back to local save", err);
  }

  // Fallback local save
  onSave(trip);
};