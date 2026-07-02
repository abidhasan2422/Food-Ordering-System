import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast,ToastContainer } from "react-toastify";
import userApi from "../utils/userApi";
import FoodCard from "../components/FoodCard";
 import PublicLayout from "../components/PublicLayout";

const Wishlist = () => {

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    // const fetchWishlist = async () => {
    //     try {

    //         const response = await userApi.get("wishlist/");

    //         setWishlist(response.data);

    //     } catch (error) {

    //         console.log(error);

    //         toast.error("Failed to load wishlist.");

    //     } finally {

    //         setLoading(false);

    //     }
    // };

    const fetchWishlist = async () => {
  try {
    const response = await userApi.get("wishlist/");
    setWishlist(response.data);

  } catch (error) {
    console.error(error);

    if (error.response?.status === 401) {
      toast.info("Please login to view your wishlist.");
    } else if (error.response?.status === 404) {
      toast.error("Wishlist not found.");
    } else {
      toast.error("Unable to load your wishlist. Please try again.");
    }

  } finally {
    setLoading(false);
  }
};

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-dark"></div>
                <p className="mt-3">Loading wishlist...</p>
            </div>
        );
    }

    return (
       <PublicLayout> 
        <div className="container py-5">

            <div className="d-flex align-items-center mb-4">
                <FaHeart
                    className="text-danger me-2"
                    size={30}
                />

                <h2 className="mb-0">
                    My Wishlist
                </h2>
            </div>

            {
                wishlist.length === 0 ? (

                    <div className="text-center py-5">

                        <FaHeart
                            size={70}
                            className="text-danger mb-3"
                        />

                        <h4>No items in your wishlist</h4>

                        <p className="text-muted">
                            Save your favorite foods and order them later.
                        </p>

                        <Link
                            to="/menu"
                            className="btn btn-dark mt-2"
                        >
                            Browse Menu
                        </Link>

                    </div>

                ) : (

                    <div className="row">

                        {
                            wishlist.map((item) => (

                                <div
                                    className="col-lg-3 col-md-4 col-sm-6 mb-4"
                                    key={item.id}
                                >
                                    <FoodCard food={item.food} />
                                </div>

                            ))
                        }

                    </div>

                )
            }

        </div>

             <ToastContainer
         position="top-right"
         autoClose={3000}
       />
        </PublicLayout>
    );

};

export default Wishlist;