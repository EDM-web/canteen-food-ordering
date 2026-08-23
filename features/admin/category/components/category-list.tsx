import { getAllCategory } from "../actions/get-all-category";
import CategoryItem from "./category-item";

const CategoryList = async () => {
  const category = await getAllCategory();
  return (
    <div className="gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {category?.map((c) => (
        <CategoryItem key={c.id} name={c.name} isCard={true} id={c.id} />
      ))}
    </div>
  );
};

export default CategoryList;
