import stripe from "../config/stripe.js";
import User from "../models/user.model.js";

export const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        // ⚠️ IMPORTANT: req.body must be RAW (not JSON parsed)
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.log("Webhook signature verification failed:", error.message);
        return res.status(400).json({
            success: false,
            message: "Webhook Error",
        });
    }

    // ✅ Handle events
    try {
        if (event.type == "checkout.session.completed") {

            const session = event.data.object;
            const userId = session.metadata.userId;
            const credits = Number(session.metadata.credits);
            const plan = session.metadata.plan;

            await User.findByIdAndUpdate(userId,{
                $inc:{credits},
                plan
            })
        }
        return res.json({received:true})
    } catch (error) {
        console.log("Webhook handling error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};