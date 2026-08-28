import React, { useEffect, useRef, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import InputLayout from "./InputLayout";

function CustomAddress({
  label,
  name,
  data = {},
  errorMessage,
  extraClassName = "",
  required = false,
  col = 4,
  maxLength,
  hideLabel = false,
  helpText,
  onChange,
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  useEffect(() => {
    if (data[name]?.value) {
      setQuery(data[name].value);
    }
  }, [data, name]);

  useEffect(() => {
    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();

      placesService.current = new window.google.maps.places.PlacesService(
        document.createElement("div"),
      );
    }
  }, []);

  const searchAddress = (event) => {
    if (!event.query || !autocompleteService.current) return;

    autocompleteService.current.getPlacePredictions(
      {
        input: event.query,
        componentRestrictions: { country: ["in", "us"] },
      },
      (predictions) => {
        if (predictions) {
          setSuggestions(
            predictions.map((p) => ({
              label: p.description,
              value: p.place_id,
            })),
          );
        } else {
          setSuggestions([]);
        }
      },
    );
  };

  const handleSelect = (e) => {
    console.log(e);

    const placeId = e.value.value;

    placesService.current.getDetails(
      {
        placeId,
        fields: ["formatted_address", "geometry", "address_components"],
      },
      (place) => {
        if (!place || !place.geometry) return;

        const location = place.geometry.location;
        const components = place.address_components;

        const extract = (type) =>
          components?.find((c) => c.types.includes(type))?.long_name || "";
        const addressLine1 = extract("street_number") + " " + extract("route");
        const formatted = {
          value: e.value,
          addressLine1: addressLine1.trim(),
          addressLine2: extract("sublocality_level_1") || "",
          city: extract("locality") || extract("administrative_area_level_2"),
          state: extract("administrative_area_level_1"),
          zipCode: extract("postal_code"),
          country: extract("country"),
          lat: location.lat(),
          lng: location.lng(),
          location: { coordinates: [location.lng(), location.lat()] },
        };

        onChange({ name, value: formatted });
      },
    );
  };

  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
      maxLength={maxLength}
      hideLabel={hideLabel}
      helpText={helpText}
    >
      <AutoComplete
        value={query}
        suggestions={suggestions}
        completeMethod={searchAddress}
        field="label"
        onChange={(e) => setQuery(e.value)}
        onSelect={handleSelect}
        placeholder="Search address"
        className="w-full"
        inputClassName="w-full"
      />
    </InputLayout>
  );
}

export default React.memo(CustomAddress);
