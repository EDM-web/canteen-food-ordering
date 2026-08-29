import { getAllCategory } from "../actions/get-all-category";
import CategoryItem from "./category-item";

const CategoryList = async () => {
  const category = await getAllCategory();

  return (
    <>
      {!category || category?.length === 0 ? (
        <div className="bg-white p-8 border rounded-lg text-muted-foreground text-center">
          No categories found
        </div>
      ) : (
        <div className="gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {category.map((c) => (
            <CategoryItem key={c.id} name={c.name} isCard={true} id={c.id} />
          ))}
        </div>
      )}
    </>
  );
};

export default CategoryList;
