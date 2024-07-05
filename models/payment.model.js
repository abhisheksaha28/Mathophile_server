import mongoose,{Schema} from 'mongoose';

const paymentSchema = new Schema(
    {
        razorpay_order_id: {
            type: String,
            required: true,
          },
          razorpay_payment_id: {
            type: String,
            required: true,
          },
          razorpay_signature: {
            type: String,
            required: true,
          },
        
          createdAt: {
            type: Date,
            default: Date.now,
          },

    }
);

export const Payment = mongoose.model("Payment",paymentSchema);