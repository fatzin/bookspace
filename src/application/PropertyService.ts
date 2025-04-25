import { Property } from "../domain/Entity/Property/Property";
import { PropertyRepository } from "../domain/Repository/PropertyRepository";

export class PropertyService {
  constructor(private propertyRepository: PropertyRepository) {}

  async findPropertyById(id: string): Promise<Property | null> {
    if (!id) {
      return null;
    }
    return await this.propertyRepository.findById(id);
  }

  async createProperty(property: Property): Promise<void> {
    await this.propertyRepository.save(property);
  }
}
