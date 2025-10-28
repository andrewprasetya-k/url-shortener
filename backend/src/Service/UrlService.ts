import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url, UrlDocument } from '../Model/UrlModel';
import { CreateUrlDto } from '../Dto/CreateUrlDto';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) {}

  // CREATE
  async create(createUrlDto: CreateUrlDto, userId: string): Promise<Url> {
    const shortenedUrl = Math.random().toString(36).substring(2, 8);
    const newUrl = new this.urlModel({ 
      ...createUrlDto, 
      shortenedUrl, 
      timesClicked: 0,
      userId 
    });

    try {
      return await newUrl.save();
    } catch (error) {
      throw new InternalServerErrorException(`Error creating shortened URL: ${error.message}`);
    }
  }

  // READ ALL
  async findAll(): Promise<Url[]> {
    return this.urlModel.find().exec();
  }

  // READ BY SHORTENED URL
  async findByShortened(shortened: string): Promise<string> {
    const url = await this.urlModel.findOne({ shortenedUrl: shortened }).exec();
    if (!url) {
      throw new NotFoundException(`${shortened} not found`);
    }
    url.timesClicked += 1;
    await url.save();
    return url.originalUrl;
  }

  // UPDATE ORIGINAL URL BY ID
  // async update(id: string, originalUrl: string): Promise<Url> {
  //   const updated = await this.urlModel.findByIdAndUpdate(
  //     id,
  //     { originalUrl },
  //     { new: true },
  //   ).exec();

  //   if (!updated) {
  //     throw new NotFoundException(`URL with id="${id}" not found`);
  //   }
  //   return updated;
  // }

  // DELETE BY SHORTENED URL
  async removeByShortened(shortened: string, userId: string): Promise<{ message: string }> {
    const url = await this.urlModel.findOne({ shortenedUrl: shortened }).exec();

    if (!url) {
      throw new NotFoundException(`URL with shortenedUrl="${shortened}" not found`);
    }

    if (url.userId !== userId) {
      throw new NotFoundException(`You don't have permission to delete this URL`);
    }

    await this.urlModel.findOneAndDelete({ shortenedUrl: shortened }).exec();
    return { message: `URL "${shortened}" successfully deleted` };
  }
}
