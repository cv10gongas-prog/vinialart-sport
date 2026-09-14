/**
 * VinilArt Sport — Centralized Payment Configuration
 * 
 * Manual payment instructions and placeholders for:
 * 1. MB WAY
 * 2. Transferência bancária
 * 3. Revolut
 * 4. PayPal
 */

export type PaymentMethodId = 'mbway' | 'bank_transfer' | 'revolut' | 'paypal';

export interface PaymentConfigItem {
  id: PaymentMethodId;
  name: string;
  badge: string;
  instructions: string;
  fields: {
    label: string;
    value: string;
    copyable?: boolean;
  }[];
  note: string;
}

export const PAYMENT_CONFIG: Record<PaymentMethodId, PaymentConfigItem> = {
  mbway: {
    id: 'mbway',
    name: 'MB WAY',
    badge: 'Imediato',
    instructions: 'Envia o valor total da encomenda por MB WAY para:',
    fields: [
      {
        label: 'Número MB WAY',
        value: '[NÚMERO MB WAY]',
        copyable: true,
      },
    ],
    note: 'Depois anexa o comprovativo abaixo.',
  },
  bank_transfer: {
    id: 'bank_transfer',
    name: 'Transferência bancária',
    badge: 'Normal / Imediata',
    instructions: 'Efetua uma transferência bancária para:',
    fields: [
      {
        label: 'IBAN',
        value: '[IBAN VINILART]',
        copyable: true,
      },
      {
        label: 'Beneficiário',
        value: 'VinilArt Sport',
      },
    ],
    note: 'Utiliza o teu nome como referência e anexa o comprovativo.',
  },
  revolut: {
    id: 'revolut',
    name: 'Revolut',
    badge: 'Instantâneo',
    instructions: 'Envia o pagamento através da aplicação Revolut para:',
    fields: [
      {
        label: 'Revtag / Contacto Revolut',
        value: '[DADOS REVOLUT]',
        copyable: true,
      },
    ],
    note: 'Indica o teu nome na descrição da transferência e anexa o comprovativo.',
  },
  paypal: {
    id: 'paypal',
    name: 'PayPal',
    badge: 'Online',
    instructions: 'Envia o pagamento via PayPal para:',
    fields: [
      {
        label: 'Email / Link PayPal',
        value: '[PAYPAL VINILART]',
        copyable: true,
      },
    ],
    note: 'Indica o teu nome ou número do pedido na nota do PayPal e anexa o comprovativo.',
  },
};
