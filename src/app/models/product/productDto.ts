export interface ProductDto{
    id: number,
    category: string,
    subcategory: string,
    name: string,
    price: number,
    rating: number,
    pictureURL: string,
    description: string,
    manufacturer: string,
    discount: number //u % popust
}