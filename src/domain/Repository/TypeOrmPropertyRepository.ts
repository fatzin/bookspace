import { Repository } from "typeorm";
import { PropertyEntity } from "../../infrastructure/persistence/Entity/PropertyEntity";
import { PropertyMapper } from "../../infrastructure/persistence/Mappers/PropertyMapper";
import { Property } from "../Entity/Property/Property";
import { PropertyRepository } from "./PropertyRepository";

export class TypeOrmPropertyRepository implements PropertyRepository {
  private readonly repository: Repository<PropertyEntity>;
  constructor(repository: Repository<PropertyEntity>) {
    this.repository = repository;
  }

  async save(property: Property): Promise<void> {
    const propertyEntity = PropertyMapper.toPersistence(property);
    await this.repository.save(propertyEntity);
  }

  async findById(id: string): Promise<Property | null> {
    const propertyEntity = await this.repository.findOne({ where: { id } });
    return propertyEntity ? PropertyMapper.toEntity(propertyEntity) : null;
  }
}
