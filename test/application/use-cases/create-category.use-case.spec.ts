import { Test } from '@nestjs/testing';
import { CreateCategoryUseCase } from '../../../src/application/use-cases/commands/create-category.use-case';
import { CachedCategoryRepository } from '../../../src/infrastructure/database/repositories/cached-category.repository';

describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase;
  let repository: any;

  beforeEach(async () => {
    repository = {
      findById: jest.fn(),
      save: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        CreateCategoryUseCase,
        { provide: CachedCategoryRepository, useValue: repository },
      ],
    }).compile();

    useCase = module.get(CreateCategoryUseCase);
  });

  it('should create root category', async () => {
    repository.save.mockImplementation((cat) => Promise.resolve(cat));

    const dto = {
      name: 'Games',
      description: 'All games',
    };

    const result = await useCase.execute(dto);

    expect(result.name).toBe('Games');
    expect(result.parentId).toBeNull();
    expect(repository.save).toHaveBeenCalled();
  });

  it('should create subcategory', async () => {
    repository.findById.mockResolvedValue({ id: 'parent-1', parentId: null });
    repository.save.mockImplementation((cat) => Promise.resolve(cat));

    const dto = {
      name: 'PS5 Games',
      parentId: 'parent-1',
    };

    const result = await useCase.execute(dto);

    expect(result.name).toBe('PS5 Games');
    expect(result.parentId).toBe('parent-1');
  });

  it('should throw error if max depth exceeded', async () => {
    repository.findById
      .mockResolvedValueOnce({ id: 'level-3', parentId: 'level-2' })
      .mockResolvedValueOnce({ id: 'level-2', parentId: 'level-1' })
      .mockResolvedValueOnce({ id: 'level-1', parentId: null });

    const dto = {
      name: 'Too Deep',
      parentId: 'level-3',
    };

    await expect(useCase.execute(dto)).rejects.toThrow('Maximum category hierarchy depth exceeded');
  });
});
