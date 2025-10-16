import React, { useEffect } from "react";
import Header from "./Header";
import { Outlet, useLocation } from "react-router";
import Footer from "./Footer";
import { CartDrawer } from "../../../components";
import { NotificationCenter, WishlistModal } from "../../../components/common";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
const UserLayout = () => {
    const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');

    return (
        <>
         <Elements stripe={stripePromise}>
            
            <div className="home-container ">
            <NotificationCenter/>
                <ScrollToTop />
                <Header />
                <CartDrawer />
                <WishlistModal />
                <div className=" pt-20">

                <Outlet />
                </div>
                <Footer />
            </div>
         </Elements>
        </>
    );
};

export default UserLayout;

