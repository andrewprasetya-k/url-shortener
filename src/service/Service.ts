import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url, UrlDocument } from '../Model/Url';
import { CreateUrlDto } from '../Dto/Dto';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) {}

  async create(createUrlDto: CreateUrlDto): Promise<Url> {
    const shortenedUrl = Math.random().toString(36).substring(2, 8);
    const newUrl = new this.urlModel({ ...createUrlDto, shortenedUrl });
    return newUrl.save();
  }

  async findAll(): Promise<Url[]> {
    return this.urlModel.find().exec();
  }

  async findByShortened(shortened: string): Promise<Url | null> {
    return this.urlModel.findOne({ shortenedUrl: shortened }).exec();
  }


  async update(id: string, originalUrl: string): Promise<Url | null> {
    return this.urlModel.findByIdAndUpdate(
      id,
      { originalUrl },
      { new: true },
    ).exec();
  }

  async removeByShortened(url: string): Promise<Url> {
    const deleted = await this.urlModel.findOneAndDelete({ shortenedUrl: url }).exec();

    if (!deleted) {
      throw new NotFoundException(`URL with shortenedUrl=${url} not found`);
    }

    return deleted;
  }
}
