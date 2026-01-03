// example inside handleSave in TripPlanner.tsx
const tripPayload = { /* same trip object you build */ };

try {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // include Authorization if using JWT: `Bearer ${token}`
    },
    body: JSON.stringify({
      name: tripPayload.name,
      start_date: tripPayload.startDate,
      end_date: tripPayload.endDate,
      cover_photo: tripPayload.coverImage,
      // include other fields as required by backend
    }),
  });

  if (!res.ok) throw new Error(await res.text());
  const saved = await res.json();
  onSave({ ...tripPayload, id: saved.id });
} catch (err) {
  console.error("Failed to save trip", err);
  // show UI error (toast)
}