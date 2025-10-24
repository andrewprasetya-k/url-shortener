import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url, UrlDocument } from '../Model/Url';
import { CreateUrlDto } from '../Dto/Dto';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) {}

  async create(createUrlDto: CreateUrlDto): Promise<Url|String> {
    const shortenedUrl = Math.random().toString(36).substring(2, 8);
    const newUrl = new this.urlModel({ ...createUrlDto, shortenedUrl });
    try {
      return newUrl.save();
    } catch (error) {
      return `Error creating shortened URL ${error}`;
    }
  }

  async findAll(): Promise<Url[]|String|null> {
    try {
      return this.urlModel.find().exec();
    } catch (error) {
      return 'No URLs found';
    }
  }

  async findByShortened(shortened: string): Promise<Url|String|null> {
    try {
      return this.urlModel.findOne({ shortenedUrl: shortened }).exec();
    } catch (error) {
      return `Url with shortenedUrl=${shortened} not found`;
    }
  }


  async update(id: string, originalUrl: string): Promise<Url | null> {
    return this.urlModel.findByIdAndUpdate(
      id,
      { originalUrl },
      { new: true },
    ).exec();
  }

  async removeByShortened(url: string): Promise<String> {
    const deleted = await this.urlModel.findOneAndDelete({ shortenedUrl: url }).exec();

    if (!deleted) {
      throw new NotFoundException(`URL with shortenedUrl=${url} not found`);
    }

    return `Url ${url} is successfully deleted`;
  }
}
