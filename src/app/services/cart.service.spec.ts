import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Cupcake } from '../models/cupcake.model';

describe('CartService', () => {
  let service: CartService;

  const mockCupcake1: Cupcake = {
    id: 1,
    name: 'Chocolate',
    price: 12.50,
    image: 'https://example.com/chocolate.jpg',
    description: 'Delicioso cupcake de chocolate'
  };

  const mockCupcake2: Cupcake = {
    id: 2,
    name: 'Morango',
    price: 11.00,
    image: 'https://example.com/morango.jpg',
    description: 'Cupcake de morango fresco'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService]
    });
    service = TestBed.inject(CartService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('inicialização', () => {
    it('deve iniciar com carrinho vazio', () => {
      expect(service.items()).toEqual([]);
      expect(service.itemCount()).toBe(0);
      expect(service.total()).toBe(0);
    });
  });

  describe('addToCart', () => {
    it('deve adicionar item ao carrinho', () => {
      service.addToCart(mockCupcake1);
      
      const items = service.items();
      expect(items.length).toBe(1);
      expect(items[0].cupcake.id).toBe(1);
      expect(items[0].quantity).toBe(1);
    });

    it('deve incrementar quantidade se item já existe', () => {
      service.addToCart(mockCupcake1);
      service.addToCart(mockCupcake1);
      
      const items = service.items();
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(2);
    });

    it('deve adicionar múltiplos itens diferentes', () => {
      service.addToCart(mockCupcake1);
      service.addToCart(mockCupcake2);
      
      const items = service.items();
      expect(items.length).toBe(2);
      expect(items[0].cupcake.id).toBe(1);
      expect(items[1].cupcake.id).toBe(2);
    });
  });

  describe('removeFromCart', () => {
    beforeEach(() => {
      service.addToCart(mockCupcake1);
      service.addToCart(mockCupcake2);
    });

    it('deve remover item do carrinho', () => {
      service.removeFromCart(1);
      
      const items = service.items();
      expect(items.length).toBe(1);
      expect(items[0].cupcake.id).toBe(2);
    });

    it('não deve afetar carrinho se ID não existe', () => {
      service.removeFromCart(999);
      
      const items = service.items();
      expect(items.length).toBe(2);
    });
  });

  describe('updateQuantity', () => {
    beforeEach(() => {
      service.addToCart(mockCupcake1);
    });

    it('deve atualizar quantidade do item', () => {
      service.updateQuantity(1, 5);
      
      const items = service.items();
      expect(items[0].quantity).toBe(5);
    });

    it('deve remover item se quantidade for 0', () => {
      service.updateQuantity(1, 0);
      
      const items = service.items();
      expect(items.length).toBe(0);
    });

    it('deve remover item se quantidade for negativa', () => {
      service.updateQuantity(1, -1);
      
      const items = service.items();
      expect(items.length).toBe(0);
    });

    it('não deve afetar outros itens', () => {
      service.addToCart(mockCupcake2);
      service.updateQuantity(1, 3);
      
      const items = service.items();
      expect(items[0].quantity).toBe(3);
      expect(items[1].quantity).toBe(1); // Não afetou o segundo item
    });
  });

  describe('clearCart', () => {
    it('deve limpar todo o carrinho', () => {
      service.addToCart(mockCupcake1);
      service.addToCart(mockCupcake2);
      service.clearCart();
      
      const items = service.items();
      expect(items.length).toBe(0);
      expect(service.itemCount()).toBe(0);
      expect(service.total()).toBe(0);
    });
  });

  describe('computed signals', () => {
    describe('itemCount', () => {
      it('deve calcular total de itens no carrinho', () => {
        service.addToCart(mockCupcake1); // 1
        service.addToCart(mockCupcake1); // 2
        service.addToCart(mockCupcake2); // 3
        
        expect(service.itemCount()).toBe(3);
      });

      it('deve atualizar quando quantidade muda', () => {
        service.addToCart(mockCupcake1);
        expect(service.itemCount()).toBe(1);
        
        service.updateQuantity(1, 5);
        expect(service.itemCount()).toBe(5);
      });
    });

    describe('total', () => {
      it('deve calcular total do carrinho', () => {
        service.addToCart(mockCupcake1); // 12.50
        service.addToCart(mockCupcake2); // 11.00
        
        expect(service.total()).toBe(23.50);
      });

      it('deve considerar quantidades múltiplas', () => {
        service.addToCart(mockCupcake1);
        service.addToCart(mockCupcake1); // 2 x 12.50 = 25.00
        
        expect(service.total()).toBe(25.00);
      });

      it('deve atualizar quando item é removido', () => {
        service.addToCart(mockCupcake1);
        service.addToCart(mockCupcake2);
        expect(service.total()).toBe(23.50);
        
        service.removeFromCart(1);
        expect(service.total()).toBe(11.00);
      });

      it('deve ser 0 para carrinho vazio', () => {
        expect(service.total()).toBe(0);
      });
    });
  });

  describe('cenários complexos', () => {
    it('deve manter consistência ao adicionar, atualizar e remover', () => {
      // Adiciona 3 itens
      service.addToCart(mockCupcake1); // 12.50
      service.addToCart(mockCupcake1); // 12.50 x 2 = 25.00
      service.addToCart(mockCupcake2); // 11.00
      
      expect(service.itemCount()).toBe(3);
      expect(service.total()).toBe(36.00);
      
      // Atualiza quantidade
      service.updateQuantity(2, 3); // 11.00 x 3 = 33.00
      expect(service.itemCount()).toBe(5);
      expect(service.total()).toBe(58.00);
      
      // Remove um item
      service.removeFromCart(1);
      expect(service.itemCount()).toBe(3);
      expect(service.total()).toBe(33.00);
    });
  });
});
