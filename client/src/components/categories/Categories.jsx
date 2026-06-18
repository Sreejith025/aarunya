import "./Categories.css";
import { Link } from "react-router-dom";

import kurtiImg from "../../assets/images/categories/kurti.jpg";
import topsImg from "../../assets/images/categories/tops.jpg";
import sareesImg from "../../assets/images/categories/sarees.webp";
import skirtsImg from "../../assets/images/categories/skirts.jpg";
import jeansImg from "../../assets/images/categories/jeans.jpg";
import activewearImg from "../../assets/images/categories/activewear.jpg";
const categoriesData = [
  {
    id: 1,
    name: "KURTI",
    image: kurtiImg,
  },
  {
    id: 2,
    name: "TOPS",
    image: topsImg,
  },
  {
    id: 3,
    name: "SAREES",
    image: sareesImg,
  },
  {
    id: 4,
    name: "SKIRTS",
    image: skirtsImg,
  },
  {
    id: 5,
    name: "JEANS",
    image: jeansImg,
  },
  {
    id: 6,
    name: "ACTIVEWEAR",
    image: activewearImg,
  },
];

export default function Categories() {
  return (
    <section className="categories-section">
      <div className="categories-container">
        {categoriesData.map((category) => (
          <Link 
            key={category.id} 
            to={`/women?category=${category.name.toLowerCase()}`} 
            className="category-item"
          >
            <div className="category-img-wrapper">
              <img src={category.image} alt={category.name} />
            </div>
            <span className="category-name">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
