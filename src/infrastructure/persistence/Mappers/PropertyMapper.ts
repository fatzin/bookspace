import { Property } from "../../../domain/Entity/Property/Property";
import { PropertyEntity } from "../Entity/PropertyEntity";

export class PropertyMapper {
  static toEntity(property: PropertyEntity): Property {
    return new Property(
      property.id,
      property.name,
      property.description,
      property.maxGuests,
      Number(property.basePricePerNight)
    );
  }

  static toPersistence(property: Property): PropertyEntity {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = property.getId();
    propertyEntity.name = property.getName();
    propertyEntity.description = property.getDescription();
    propertyEntity.maxGuests = property.getMaxGuests();
    propertyEntity.basePricePerNight = property.getBasePricePerNight();
    return propertyEntity;
  }
}
