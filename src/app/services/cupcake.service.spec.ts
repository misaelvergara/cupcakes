import { CupcakeService } from './cupcake.service';
import { Cupcake } from '../models/cupcake.model';
import { of, throwError } from 'rxjs';

describe('CupcakeService', () => {
  let service: CupcakeService;
  let mockHttpClient: any;

  const mockCupcakes: Cupcake[] = [
    {
      id: 1,
      name: 'Chocolate',
      price: 12.50,
      image: 'https://example.com/chocolate.jpg',
      description: 'Delicioso cupcake de chocolate'
    },
    {
      id: 2,
      name: 'Morango',
      price: 11.00,
      image: 'https://example.com/morango.jpg',
      description: 'Cupcake de morango fresco'
    }
  ];

  beforeEach(() => {
    // Mock do HttpClient
    mockHttpClient = {
      get: jest.fn().mockReturnValue(of(mockCupcakes)),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };

    service = new CupcakeService(mockHttpClient);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('loadCupcakes (construtor)', () => {
    it('deve carregar cupcakes na inicialização', () => {
      expect(mockHttpClient.get).toHaveBeenCalled();
      const cupcakes = service.getCupcakes();
      expect(cupcakes.length).toBe(2);
      expect(cupcakes).toEqual(mockCupcakes);
    });

    it('deve usar signal para armazenar cupcakes', () => {
      const cupcakes = service.getCupcakes();
      expect(Array.isArray(cupcakes)).toBe(true);
      expect(cupcakes.length).toBeGreaterThan(0);
    });
  });

  describe('getCupcakes', () => {
    it('deve retornar array de cupcakes', () => {
      const result = service.getCupcakes();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    it('deve retornar cupcakes com estrutura correta', () => {
      const cupcakes = service.getCupcakes();
      const firstCupcake = cupcakes[0];

      expect(firstCupcake.id).toBeDefined();
      expect(firstCupcake.name).toBeDefined();
      expect(firstCupcake.price).toBeDefined();
      expect(firstCupcake.image).toBeDefined();
      expect(firstCupcake.description).toBeDefined();
    });
  });

  describe('getCupcakeById', () => {
    it('deve retornar cupcake específico pelo ID', () => {
      const cupcake = service.getCupcakeById(1);
      expect(cupcake).toBeDefined();
      expect(cupcake?.id).toBe(1);
      expect(cupcake?.name).toBe('Chocolate');
    });

    it('deve retornar undefined para ID inexistente', () => {
      const cupcake = service.getCupcakeById(999);
      expect(cupcake).toBeUndefined();
    });
  });

  describe('addCupcake', () => {
    it('deve adicionar novo cupcake', (done) => {
      const newCupcake: Cupcake = {
        id: 3,
        name: 'Baunilha',
        price: 10.00,
        image: 'https://example.com/baunilha.jpg',
        description: 'Cupcake de baunilha'
      };

      mockHttpClient.post.mockReturnValue(of(newCupcake));

      service.addCupcake(newCupcake).subscribe(() => {
        const cupcakes = service.getCupcakes();
        expect(cupcakes.length).toBe(3);
        const added = cupcakes.find(c => c.id === 3);
        expect(added).toEqual(newCupcake);
        done();
      });
    });
  });

  describe('updateCupcake', () => {
    it('deve atualizar cupcake existente', (done) => {
      const updatedCupcake: Cupcake = {
        id: 1,
        name: 'Chocolate Premium',
        price: 15.00,
        image: 'https://example.com/chocolate-premium.jpg',
        description: 'Cupcake de chocolate premium'
      };

      mockHttpClient.put.mockReturnValue(of(updatedCupcake));

      service.updateCupcake(updatedCupcake).subscribe(() => {
        const cupcake = service.getCupcakeById(1);
        expect(cupcake?.name).toBe('Chocolate Premium');
        expect(cupcake?.price).toBe(15.00);
        done();
      });
    });
  });

  describe('deleteCupcake', () => {
    it('deve deletar cupcake', (done) => {
      mockHttpClient.delete.mockReturnValue(of({}));

      service.deleteCupcake(1).subscribe(() => {
        const cupcakes = service.getCupcakes();
        expect(cupcakes.length).toBe(1);
        expect(cupcakes.find(c => c.id === 1)).toBeUndefined();
        done();
      });
    });
  });

  describe('error handling', () => {
    it('deve lidar com erro ao carregar cupcakes', () => {
      const errorMockHttp = {
        get: jest.fn().mockReturnValue(throwError(() => new Error('Network error')))
      };

      // Mock console.error
      const originalError = console.error;
      console.error = jest.fn();

      const errorService = new CupcakeService(errorMockHttp as any);

      expect(errorService.getCupcakes().length).toBe(0);
      expect(console.error).toHaveBeenCalled();

      // Restore
      console.error = originalError;
    });
  });
});
