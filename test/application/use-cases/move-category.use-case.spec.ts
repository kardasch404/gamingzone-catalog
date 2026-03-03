import { Test } from '@nestjs/testing';
import { MoveCategoryUseCase } from '../../../src/application/use-cases/commands/move-category.use-case';
import { CachedCategoryRepository } from '../../../src/infrastructure/database/repositories/cached-category.repository';
import { Category } from '../../../src/domain/entities/category.entity';

describe('MoveCategoryUseCase', () => {
  let useCase: MoveCategoryUseCase;
  let repository: any;

  beforeEach(async () => {
    repository = {
      findById: jest.fn(),
      save: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        MoveCategoryUseCase,
        { provide: CachedCategoryRepository, useValue: repository },
      ],
    }).compile();

    useCase = module.get(MoveCategoryUseCase);
  });

  it('should move category to new parent', async () => {
    const category = Category.create('cat-1', 'Games', null, null, 'old-parent');
    const newParent = Category.create('new-parent', 'Parent', null, null, null);
    
    repository.findById.mockImplementation((id: string) => {
      if (id === 'cat-1') return Promise.resolve(category);
      if (id === 'new-parent') return Promise.resolve(newParent);
      return Promise.resolve(null);
    });
    repository.save.mockImplementation((cat) => Promise.resolve(cat));

    const result = await useCase.execute('cat-1', 'new-parent');

    expect(result.parentId).toBe('new-parent');
    expect(repository.save).toHaveBeenCalled();
  });

  it('should throw error if category is its own parent', async () => {
    const category = Category.create('cat-1', 'Games');
    repository.findById.mockResolvedValue(category);

    await expect(useCase.execute('cat-1', 'cat-1')).rejects.toThrow('Category cannot be its own parent');
  });
});
