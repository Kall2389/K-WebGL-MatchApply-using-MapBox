
export interface Order {
  id: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  amount: number;
  color: string;
  timestamp: number;
}

export interface OrderMarker {
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  color: string;
  timestamp: number;
}

export interface CountryData {
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  cities: CityData[];
}

export interface CityData {
  name: string;
  latitude: number;
  longitude: number;
}
