import { MapPin } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { useState } from "react";
import { Card } from "../ui/Card.jsx";
import { Field } from "../ui/Field.jsx";

export function Address({ addresses, loading, addAddress }) {
  const [location, setLocation] = useState(null);
  const useLiveLocation = () => {
    if (!navigator.geolocation) return alert("Live location is not supported by this browser.");
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const next = { latitude: coords.latitude, longitude: coords.longitude };
      const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (key) {
        try {
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${key}`);
          const data = await response.json();
          const result = data.results?.[0];
          if (result) { next.placeId = result.place_id; next.formattedAddress = result.formatted_address; }
        } catch { /* Coordinates are still saved if reverse geocoding is unavailable. */ }
      }
      setLocation(next);
    }, () => alert("Location permission is required to use live location."), { enableHighAccuracy: true, timeout: 10000 });
  };
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-12">
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <h2 className="text-xl font-bold text-slate-900">Add address</h2>
          <p className="mt-1 text-sm text-slate-600">Save once — reuse while booking any service.</p>
          <form className="mt-6 grid gap-4" onSubmit={addAddress}>
            <input type="hidden" name="location" value={location ? JSON.stringify(location) : ""} />
            <Field label="Line 1">
              <input name="line1" required />
            </Field>
            <Field label="Line 2">
              <input name="line2" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City">
                <input name="city" required />
              </Field>
              <Field label="State">
                <input name="state" required />
              </Field>
            </div>
            <Field label="Pincode">
              <input name="pincode" pattern="[0-9]{6}" required />
            </Field>
            <Button variant="primary" disabled={loading} type="submit">
              Save address
            </Button>
            <Button variant="secondary" type="button" onClick={useLiveLocation}>
              {location ? "Live location attached" : "Use live location"}
            </Button>
          </form>
        </Card>
        <Card className="h-fit">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
            <MapPin className="h-5 w-5" aria-hidden />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Saved addresses</h3>
          <div className="mt-4 grid gap-3">
            {addresses.length ? (
              addresses.map((address) => (
                <div key={address._id} className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                  <strong className="text-slate-900">{address.line1}</strong>
                  <p className="mt-1 text-sm text-slate-600">
                    {address.city}, {address.state} — {address.pincode}
                  </p>
                  {address.location?.latitude != null && <p className="mt-1 text-xs text-slate-500">Live location saved</p>}
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
                No saved address yet.
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
