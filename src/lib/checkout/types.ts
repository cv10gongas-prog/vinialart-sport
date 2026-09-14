import type { CartItem } from '@/lib/cart/types';
import type { PaymentMethodId } from './payment-config';

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  taxId?: string | undefined; // NIF (opcional)
}

export type OrderPaymentStatus =
  | 'pending-payment-verification'
  | 'payment-confirmed'
  | 'in-production'
  | 'completed'
  | 'cancelled';

export const ORDER_STATUS_LABELS: Record<OrderPaymentStatus, string> = {
  'pending-payment-verification': 'A aguardar confirmação de pagamento',
  'payment-confirmed': 'Pagamento confirmado',
  'in-production': 'Em produção',
  'completed': 'Concluído',
  'cancelled': 'Cancelado',
};

export interface PaymentProofFile {
  fileKey: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  previewUrl?: string | undefined;
  uploadedAt: number;
}

export interface PaymentDetails {
  method: PaymentMethodId;
  methodName: string;
  proofFile: PaymentProofFile;
  status: OrderPaymentStatus;
  submittedAt: number;
}

export interface OrderRecord {
  orderId: string;
  createdAt: number;
  customer: CustomerDetails;
  items: CartItem[];
  totalItems: number;
  payment: PaymentDetails;
  status: OrderPaymentStatus;
  privacyAccepted: boolean;
  notes?: string;
}
