import Razorpay from "razorpay";
import crypto from "crypto";

export function getRazorpayInstance() {
  const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_TfKwgALCzFrTl9";
  const key_secret = process.env.RAZORPAY_KEY_SECRET || "pKveSml08mrbjoI1CDgLoy1B";

  return new Razorpay({
    key_id,
    key_secret,
  });
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const key_secret = process.env.RAZORPAY_KEY_SECRET || "pKveSml08mrbjoI1CDgLoy1B";
  const generatedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return generatedSignature === signature;
}
