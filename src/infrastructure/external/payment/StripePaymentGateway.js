export class StripePaymentGateway {
    async process(method, amount) {
        console.log(`Processing ${method} payment of $${amount} via Stripe...`);
        // Simulating 95% success rate
        const isSuccess = Math.random() > 0.05;
        return {
            success: isSuccess,
            transactionId: isSuccess ? `TXN-${Math.random().toString(36).substr(2, 9)}` : null
        };
    }
}
