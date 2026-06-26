
import '../styles/search.css'
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const SearchPage = () => {
  const [foods, setFoods] = useState([]);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
 
 useEffect(() => {
  const fetchFoods = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/search-food/?keyword=${keyword}`
      );

      const data = await response.json();

      setFoods(data);
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
    className="col-md-4 mb-4"
    key={food.id}
  >
    <div className="card">
      <img
        src={`http://127.0.0.1:8000${food.image}`}
        alt={food.item_name}
      />

      <div className="card-body">
        <h5>{food.item_name}</h5>

        <p>
          ৳{food.item_price}
        </p>
      </div>
    </div>
  </div>
))}
      </div>
    </div>
    </>
  );
};

export default SearchPage;