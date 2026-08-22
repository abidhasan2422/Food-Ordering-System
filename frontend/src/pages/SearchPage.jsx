
import '../styles/search.css'
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";
import userApi from "../utils/userApi";


const SearchPage = () => {
  const [foods, setFoods] = useState([]);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
 
 useEffect(() => {
  const fetchFoods = async () => {
    try {
      const response = await userApi.get(
  `search-food/?keyword=${encodeURIComponent(keyword)}`
);

setFoods(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (keyword) {
    fetchFoods();
  }
}, [keyword]);


  return (
    <>
     <Navbar />
    <div className="container py-5">
     

      <h5 className="mb-4">
        Showing {foods.length} results
      </h5>

      <div className="row">
        {foods.map((food) => (
  <div
    className="col-lg-3 col-md-4 col-sm-6 mb-4"
    key={food.id}
  >
    <FoodCard food={food} /> 
  </div>
))}
      </div>
    </div>
    </>
  );
};

export default SearchPage;