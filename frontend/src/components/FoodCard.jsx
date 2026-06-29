import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import userApi from "../utils/userApi";

const FoodCard = ({food}) => {
const [isWishlisted, setIsWishlisted] = useState(false);
useEffect(() => {
    checkWishlist();
}, [food.id]);

const checkWishlist = async () => {
    try {
        const response = await userApi.get(
            `wishlist/check/${food.id}/`
        );

        setIsWishlisted(response.data.is_wishlisted);

    } catch (error) {
        console.log(error);
    }
};
const toggleWishlist = async () => {

    try {

        if (isWishlisted) {

            const response = await userApi.delete(
                `wishlist/remove/${food.id}/`
            );

            setIsWishlisted(false);

            toast.success(response.data.message);

        } else {

            const response = await userApi.post(
                `wishlist/add/${food.id}/`
            );

            setIsWishlisted(true);

            toast.success(response.data.message);

        }

    } catch (error) {

        const errors = error.response?.data;

        if (errors.message) {
            toast.error(errors.message);
        } else {
            toast.error("Something went wrong.");
        }

    }

};
  return (

       <div
    className="food-card"
    style={{ position: "relative" }}
>
           <div
    onClick={toggleWishlist}
    style={{
        position: "absolute",
        top: "12px",
        right: "12px",
        zIndex: 10,
        cursor: "pointer",
        background: "#fff",
        borderRadius: "50%",
        padding: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,.2)"
    }}
>


    {
        isWishlisted
            ?
            <FaHeart color="red" size={22}/>
            :
            <FaRegHeart size={22}/>
    }
</div>
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