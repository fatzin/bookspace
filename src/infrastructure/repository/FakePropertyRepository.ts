import { Property } from "../../domain/Entity/Property/Property";
import { PropertyRepository } from "../../domain/Repository/PropertyRepository";

export class FakePropertyRepository implements PropertyRepository {
  private properties: Property[] = [
    new Property(
      "1",
      "Casa de Praia",
      "Uma linda casa de praia com vista para o mar.",
      4,
      200
    ),
    new Property(
      "2",
      "Apartamento na Cidade",
      "Um apartamento moderno no centro da cidade.",
      2,
      150
    ),
    new Property(
      "3",
      "Chalé na Montanha",
      "Um chalé aconchegante nas montanhas.",
      6,
      300
    ),
  ];

  async save(property: Property): Promise<void> {
    const existingPropertyIndex = this.properties.findIndex(
      (p) => p.getId() === property.getId()
    );

    if (existingPropertyIndex !== -1) {
      this.properties[existingPropertyIndex] = property;
    } else {
      this.properties.push(property);
    }
  }

  async findById(id: string): Promise<Property | null> {
    const property = this.properties.find((p) => p.getId() === id);
    return property ? property : null;
  }
}
