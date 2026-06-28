import { Link } from "react-router-dom";

const FoodCard = ({ food }) => {

    return (

        <div className="food-card">

            <img
                src={`http://127.0.0.1:8000${food.image}`}
                alt={food.item_name}
                className="food-image"
            />

            <div className="food-body">

                <h5 className="food-title">
                    {food.item_name}
                </h5>

                <p className="food-description">
                    {food.item_description}
                </p>

                <p className="food-price">
                    ৳{food.item_price}
                </p>

                <p>
                    {food.is_available ? (

                        <Link
                            to={`/food/${food.id}`}
                            className="btn btn-outline-primary btn-sm"
                        >
                            <i className="fas fa-shopping-basket me-1"></i>
                            Order Now
                        </Link>

                    ) : (

                        <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled
                        >
                            Unavailable
                        </button>

                    )}
                </p>

            </div>

        </div>

    );

};

export default FoodCard;