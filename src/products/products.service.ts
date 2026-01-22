import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { In, Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { Category } from './entity/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { S3Service } from './s3.service';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ProductImage } from './entity/product-image.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
        @InjectRepository(ProductImage) private readonly imageRepository: Repository<ProductImage>,
        private readonly s3Service: S3Service
    ){}
    
    async uploadProductImage(file: Express.Multer.File, productID: string) {
        const product = await this.productRepository.findOne({where: {id: +productID}});
        if(!product) throw new NotFoundException('Product ID not found!');
        const key = `uploads/${Date.now()}-${file.originalname}`;
        await this.s3Service.client.send(
            new PutObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET,
              Key: key,
              Body: file.buffer,
              ContentType: file.mimetype,
            }),
        );
        const productImage = await this.imageRepository.create({
            product,
            imageUrl: key,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        await this.imageRepository.save(productImage);  
        return { message: 'File uploaded successfully', key };
    }

    async getPresignedURL(fileName: string, productID: string){
        const product = await this.productRepository.findOne({where: {id: +productID}});
        if(!product) throw new NotFoundException('Product ID not found!');
        const s3 = new S3Client({ region: process.env.AWS_REGION });
        const key = `uploads/${Date.now()}-${fileName}`;
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            ContentType: 'image',
          });
        const productImage = await this.imageRepository.create({
            product,
            imageUrl: key,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await this.imageRepository.save(productImage);  
        const uploadURL = await getSignedUrl(s3, command, {expiresIn: 60 * 5});  
        return { uploadURL, key };
    }

    async createCategory(createCategoryDto: CreateCategoryDto, userID: string){
        const user = await this.userRepository.findOne({where: {id: +userID}});
        if(!user) throw new UnauthorizedException('Token Invalid');
        if(user.role !== 'ADMIN') throw new ConflictException('Only ADMIN can create a new Category');
        const exists = await this.categoryRepository.findOne({where: {name: createCategoryDto.name}});
        if(exists) throw new ConflictException('Category already exists');
        const category = await this.categoryRepository.create({
            name: createCategoryDto.name,
            description: createCategoryDto.description,
            createdAt: new Date()
        });
        return await this.categoryRepository.save(category);
    }

    async getAllCategories(){
        return await this.categoryRepository.find();
    }

    async createProduct(createProductDto: CreateProductDto, userID: string) {
        const user = await this.userRepository.findOne({where: {id: +userID}});
        if(!user) throw new UnauthorizedException('Token Invalid');
        if(user.role !== 'ADMIN') throw new ConflictException('Only ADMIN can create a new Product');
        const categories = await this.categoryRepository.find({
            where: { id: In(createProductDto.categoryIDs) },
        });
        const product = await this.productRepository.create({
            name: createProductDto.name,
            description: createProductDto.description,
            price: createProductDto.price,
            stock: createProductDto.stock,
            categories,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return await this.productRepository.save(product);
    }

    async getProductByID(id: string) {
        const product = await this.productRepository.findOne({where: {id: +id}});
        if(!product) throw new NotFoundException('Product not found');
        return product;
    }

    async getProducts(page: number, limit: number, sortBy: string, order: 'ASCENDING' | 'DECENDING', search?: string, category?: string) {
        const skip = (page - 1) * limit;
        const sortableField = ['price', 'createdAt', 'name', 'stock'];
        const sortColumn = sortableField.includes(sortBy) ? sortBy : 'createdAt';
        const query = this.productRepository.createQueryBuilder('product').leftJoinAndSelect('product.categories', 'category').leftJoinAndSelect('product.productImages', 'images');
        if(search){
            query.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', { search: `%${search}%` },);
        }
        if(category){
            query.andWhere('category.name = :category', {category});
        }
        query.orderBy(`product.${sortColumn}`, order === 'ASCENDING' ? 'ASC' : 'DESC');
        query.skip(skip).take(limit);
        const [product, total] = await query.getManyAndCount();
        return {
            data: product, 
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
}
