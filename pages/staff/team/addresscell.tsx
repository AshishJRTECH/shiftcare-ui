import { useEffect, useState } from "react";

interface AddressCellProps {
  latitude: number | null;
  longitude: number | null;
}

const AddressCell = ({ latitude, longitude }: AddressCellProps) => {
  const [address, setAddress] = useState<string | null>("Fetching address...");

  useEffect(() => {
    const fetchAddress = async () => {
      if (latitude !== null && longitude !== null) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          setAddress(data.display_name || "Address not available");
        } catch (error) {
          console.error("Error fetching address:", error);
          setAddress("Error fetching address");
        }
      } else {
        setAddress("Coordinates not available");
      }
    };

    fetchAddress();
  }, [latitude, longitude]);

  return <span>{address}</span>;
};

export default AddressCell;
