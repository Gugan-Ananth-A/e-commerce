import { Body, Controller, Get, Param, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService){}

    @Get()
    @UseGuards(AuthGuard)
    async getProducts(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('sortBy') sortBy: string = 'createdAt',
        @Query('order') order: 'ASCENDING' | 'DECENDING' = 'DECENDING',
        @Query('search') search?: string,
        @Query('category') category?: string,
    ){
        return this.productsService.getProducts(Number(page), Number(limit), sortBy, order, search, category);
    }

    @Post()
    @UseGuards(AuthGuard)
    async createProduct(@Req() request: Request, @Body(new ValidationPipe({transform: true})) createProductDto: CreateProductDto){
        const payload = request['payload'];
        return this.productsService.createProduct(createProductDto, payload.sub);
    }

    @Get('categories')
    @UseGuards(AuthGuard)
    async getCategories(){
        return this.productsService.getAllCategories();
    }

    @Post('create-category')
    @UseGuards(AuthGuard)
    async createCategory(@Req() request: Request, @Body() createCategoryDto: CreateCategoryDto){
        const payload = request['payload'];
        return this.productsService.createCategory(createCategoryDto, payload.sub);
    }
    
    @Post('image-upload/:id')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File){
        return this.productsService.uploadProductImage(file, id);
    }

    @Get('presigned-url/:id')
    @UseGuards(AuthGuard)
    async getPresignedURL(@Param('id') id: string, @Query('fileName') fileName: string){
        return this.productsService.getPresignedURL(fileName, id);
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getProductByID(@Query('id') id: string){
        return this.productsService.getProductByID(id);
    }
}
