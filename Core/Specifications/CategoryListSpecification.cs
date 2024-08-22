using Core.Entities;
using Core.Specidications;

namespace Core.Specifications;

public class CategoryListSpecification : BaseSpecification<Product, string>
{
    public CategoryListSpecification()
    {
        AddSelect(x => x.Category);
        ApplyDistinct();
    }
}
