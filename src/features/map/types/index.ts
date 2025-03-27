import { Monster } from '../../../models/Monster';

// Location data for AR integration
export interface LocationPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'monster' | 'treasure' | 'quest';
  data: any;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MapRegion extends Coordinates {
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface TreasureData {
  gold: number;
}
