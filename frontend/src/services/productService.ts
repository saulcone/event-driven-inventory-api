import api from './api';

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: string;
  stock_quantity: number;
  total_sold: number;
}

export interface ProductPage {
  items: Product[];
  count: number;
  next?: string | null;
  previous?: string | null;
}

export interface ProductSummary {
  total_products: number;
  low_stock_items: number;
  total_sold: number;
}

export interface ProductQuery {
  search?: string;
  orderBy?: string;
  page?: number;
}

export interface ProductInput {
  name: string;
  description: string;
  category: string;
  price: string | number;
  stock_quantity: number;
}

export const productService = {
  getAll: async (query: ProductQuery = {}): Promise<ProductPage> => {
    const { search, orderBy, page } = query;
    const { data } = await api.get<ProductPage>('/products/', {
      params: {
        search,
        order_by: orderBy,
        page,
      },
    });
    return data;
  },
  getMostSold: async (): Promise<ProductPage> => {
    const { data } = await api.get<ProductPage>('/products/most-sold');
    return data;
  },
  getSummary: async (): Promise<ProductSummary> => {
    const { data } = await api.get<ProductSummary>('/products/summary');
    return data;
  },
  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },
  create: async (productData: ProductInput): Promise<Product> => {
    const { data } = await api.post<Product>('/products/', productData);
    return data;
  },
  update: async (id: number, productData: Partial<ProductInput>): Promise<Product> => {
    const { data } = await api.put<Product>(`/products/${id}`, productData);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
