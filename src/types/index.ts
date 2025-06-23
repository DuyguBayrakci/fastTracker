// Ana uygulama type tanımları
export * from './fasting';
export * from './navigation';

// Genel utility types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Timestamp = Date | string | number;

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
