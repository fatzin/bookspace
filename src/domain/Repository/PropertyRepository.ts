import { Property } from "./../Entity/Property/Property";
export interface PropertyRepository {
  save(property: Property): Promise<void>;
  findById(id: string): Promise<Property | null>;
}
