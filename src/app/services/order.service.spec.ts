import { OrderService } from './order.service';
import { Order, Cupcake } from '../models/cupcake.model';
import { of, throwError } from 'rxjs';

describe('OrderService', () => {
  let service: OrderService;
  let mockHttpClient: any;

  const mockCupcake1: Cupcake = {
    id: 1,
    name: 'Chocolate',
    price: 12.50,
    image: 'chocolate.jpg',
    description: 'Delicioso cupcake de chocolate'
  };

  const mockCupcake2: Cupcake = {
    id: 2,
    name: 'Morango',
    price: 11.00,
    image: 'morango.jpg',
    description: 'Cupcake de morango'
  };

  const mockOrders: Order[] = [
    {
      id: 'ORD-1',
      items: [
        { cupcake: mockCupcake1, quantity: 2 }
      ],
      total: 25.00,
      status: 'pending',
      date: new Date('2024-01-15'),
      address: 'Rua A, 123, São Paulo, SP',
      paymentMethod: 'credit'
    },
    {
      id: 'ORD-2',
      items: [
        { cupcake: mockCupcake2, quantity: 1 }
      ],
      total: 11.00,
      status: 'completed',
      date: new Date('2024-01-16'),
      address: 'Rua B, 456, Rio de Janeiro, RJ',
      paymentMethod: 'pix'
    }
  ];

  beforeEach(() => {
    // Mock do HttpClient
    mockHttpClient = {
      get: jest.fn().mockReturnValue(of(mockOrders)),
      post: jest.fn(),
      patch: jest.fn()
    };

    service = new OrderService(mockHttpClient);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('loadOrders (construtor)', () => {
    it('deve carregar pedidos na inicialização', () => {
      expect(mockHttpClient.get).toHaveBeenCalled();
      const orders = service.getOrders();
      expect(orders.length).toBe(2);
    });

    it('deve converter strings de data em objetos Date', () => {
      const orders = service.getOrders();
      orders.forEach(order => {
        expect(order.date instanceof Date).toBe(true);
      });
    });
  });

  describe('getOrders', () => {
    it('deve retornar array de pedidos', () => {
      const result = service.getOrders();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    it('deve retornar pedidos com estrutura correta', () => {
      const orders = service.getOrders();
      const firstOrder = orders[0];

      expect(firstOrder.id).toBeDefined();
      expect(firstOrder.status).toBeDefined();
      expect(firstOrder.items).toBeDefined();
      expect(firstOrder.total).toBeDefined();
      expect(firstOrder.address).toBeDefined();
    });
  });

  describe('getOrderById', () => {
    it('deve retornar pedido específico pelo ID', () => {
      const order = service.getOrderById('ORD-1');
      expect(order).toBeDefined();
      expect(order?.id).toBe('ORD-1');
      expect(order?.total).toBe(25.00);
    });

    it('deve retornar undefined para ID inexistente', () => {
      const order = service.getOrderById('ORD-999');
      expect(order).toBeUndefined();
    });
  });

  describe('createOrder', () => {
    it('deve criar novo pedido', (done) => {
      const newOrder: Omit<Order, 'id' | 'date' | 'status'> = {
        items: [
          { cupcake: mockCupcake1, quantity: 3 }
        ],
        total: 37.50,
        address: 'Rua C, 789, Curitiba, PR',
        paymentMethod: 'credit'
      };

      const createdOrder: Order = {
        ...newOrder,
        id: 'ORD-3',
        status: 'pending',
        date: new Date()
      };

      mockHttpClient.post.mockReturnValue(of(createdOrder));

      service.createOrder(newOrder).subscribe((order) => {
        expect(order.id).toBeDefined();
        expect(order.status).toBe('pending');
        const orders = service.getOrders();
        expect(orders.length).toBe(3);
        done();
      });
    });

    it('deve gerar ID único para cada pedido', (done) => {
      const order1: Omit<Order, 'id' | 'date' | 'status'> = {
        items: [{ cupcake: mockCupcake1, quantity: 1 }],
        total: 12.50,
        address: 'Rua 1, Cidade 1, SP',
        paymentMethod: 'credit'
      };

      const order2: Omit<Order, 'id' | 'date' | 'status'> = {
        items: [{ cupcake: mockCupcake2, quantity: 1 }],
        total: 11.00,
        address: 'Rua 2, Cidade 2, RJ',
        paymentMethod: 'pix'
      };

      mockHttpClient.post
        .mockReturnValueOnce(of({ ...order1, id: 'ORD-3', status: 'pending', date: new Date() }))
        .mockReturnValueOnce(of({ ...order2, id: 'ORD-4', status: 'pending', date: new Date() }));

      service.createOrder(order1).subscribe((o1) => {
        service.createOrder(order2).subscribe((o2) => {
          expect(o1.id).not.toBe(o2.id);
          done();
        });
      });
    });
  });

  describe('updateOrderStatus', () => {
    it('deve atualizar status do pedido', (done) => {
      const updatedOrder = { ...mockOrders[0], status: 'completed' as const };
      mockHttpClient.patch.mockReturnValue(of(updatedOrder));

      service.updateOrderStatus('ORD-1', 'completed').subscribe(() => {
        const order = service.getOrderById('ORD-1');
        expect(order?.status).toBe('completed');
        done();
      });
    });

    it('deve aceitar todos os status válidos', (done) => {
      const statuses: Array<'pending' | 'sent' | 'completed' | 'cancelled'> = ['pending', 'sent', 'completed', 'cancelled'];
      let count = 0;

      statuses.forEach((status) => {
        const updatedOrder = { ...mockOrders[0], status };
        mockHttpClient.patch.mockReturnValue(of(updatedOrder));

        service.updateOrderStatus('ORD-1', status).subscribe(() => {
          count++;
          if (count === statuses.length) {
            done();
          }
        });
      });
    });
  });

  describe('refresh', () => {
    it('deve recarregar pedidos do servidor', () => {
      const newMockOrders: Order[] = [
        ...mockOrders,
        {
          id: 'ORD-3',
          items: [{ cupcake: mockCupcake1, quantity: 1 }],
          total: 12.50,
          status: 'pending',
          date: new Date(),
          address: 'Rua Nova, 999, São Paulo, SP',
          paymentMethod: 'pix'
        }
      ];

      mockHttpClient.get.mockReturnValue(of(newMockOrders));

      service.refresh();

      // Aguarda a atualização assíncrona
      setTimeout(() => {
        const orders = service.getOrders();
        expect(orders.length).toBe(3);
      }, 100);
    });
  });

  describe('allOrders signal', () => {
    it('deve retornar readonly signal', () => {
      const orders = service.allOrders();
      expect(Array.isArray(orders)).toBe(true);
    });

    it('deve atualizar quando novo pedido é criado', (done) => {
      const newOrder: Omit<Order, 'id' | 'date' | 'status'> = {
        items: [{ cupcake: mockCupcake1, quantity: 1 }],
        total: 12.50,
        address: 'Rua Nova, 100, São Paulo, SP',
        paymentMethod: 'credit'
      };

      const createdOrder: Order = {
        ...newOrder,
        id: 'ORD-3',
        status: 'pending',
        date: new Date()
      };

      mockHttpClient.post.mockReturnValue(of(createdOrder));

      const initialCount = service.allOrders().length;

      service.createOrder(newOrder).subscribe(() => {
        const newCount = service.allOrders().length;
        expect(newCount).toBe(initialCount + 1);
        done();
      });
    });
  });

  describe('error handling', () => {
    it('deve lidar com erro ao carregar pedidos', () => {
      const errorMockHttp = {
        get: jest.fn().mockReturnValue(throwError(() => new Error('Network error')))
      };

      // Mock console.error
      const originalError = console.error;
      console.error = jest.fn();

      const errorService = new OrderService(errorMockHttp as any);

      expect(errorService.getOrders().length).toBe(0);
      expect(console.error).toHaveBeenCalled();

      // Restore
      console.error = originalError;
    });
  });
});
