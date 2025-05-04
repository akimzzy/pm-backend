import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  async create(
    createPropertyDto: CreatePropertyDto,
    user: any,
    files?: Express.Multer.File[],
  ) {
    if (user.accountType !== 'manager') {
      throw new ForbiddenException('Only managers can create properties');
    }
    let images: string[] = createPropertyDto.images || [];
    if (files && files.length > 0) {
      // Save file paths or URLs to images array
      images = images.concat(files.map((file) => file.path || file.filename));
    }
    const property = this.propertyRepository.create({
      ...createPropertyDto,
      images,
    });
    return this.propertyRepository.save(property);
  }

  findAll() {
    return this.propertyRepository.find();
  }

  findOne(id: number) {
    return this.propertyRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updatePropertyDto: UpdatePropertyDto,
    files?: Express.Multer.File[],
  ) {
    const property = await this.propertyRepository.findOneBy({ id });
    if (!property) {
      throw new Error('Property not found');
    }
    let images: string[] = updatePropertyDto.images || property.images || [];
    if (files && files.length > 0) {
      images = images.concat(files.map((file) => file.path || file.filename));
    }
    await this.propertyRepository.update(id, { ...updatePropertyDto, images });
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.propertyRepository.delete(id);
    return { deleted: true };
  }
}
