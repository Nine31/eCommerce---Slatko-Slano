 using Core.Entities;
 using Core.Interfaces;
 using Microsoft.Extensions.Configuration;
 using Stripe;
 namespace Infrastructure.Services;
 public class PaymentService(IConfiguration config, ICartService cartService,
    IUnitOfWork unit) : IPaymentService
 {
    public async Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];
        var cart = await cartService.GetCartAsync(cartId)
            ?? throw new Exception("Korpa nedostupna");
        var shippingPrice = await GetShippingPriceAsync(cart) ?? 0;
        await ValidateCartItemsInCartAsync(cart);
        var subtotal = CalculateSubtotal(cart);
        if (cart.Coupon != null)
        {
            subtotal = await ApplyDiscountAsync(cart.Coupon, subtotal);
        }
        var total = subtotal + shippingPrice;
        await CreateUpdatePaymentIntentAsync(cart, total);
        await cartService.SetCartAsync(cart);
        return cart;
    }

    private async Task CreateUpdatePaymentIntentAsync(ShoppingCart cart, 
    long total)
    {
        var service = new PaymentIntentService();
        if (string.IsNullOrEmpty(cart.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = total,
                Currency = "bam",
                PaymentMethodTypes = ["card"]
            };
            var intent = await service.CreateAsync(options);
            cart.PaymentIntentId = intent.Id;
            cart.ClientSecret = intent.ClientSecret;
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = total
            };
            await service.UpdateAsync(cart.PaymentIntentId, options);
        }
    }

    private async Task<long> ApplyDiscountAsync(AppCoupon appCoupon, 
    long amount)
    {
        var couponService = new Stripe.CouponService();

        var coupon = await couponService.GetAsync(appCoupon.CouponId);

        if (coupon.AmountOff.HasValue)
        {
            amount -= (long)coupon.AmountOff * 100;
        }

        if (coupon.PercentOff.HasValue)
        {
            var discount = amount * (coupon.PercentOff.Value / 100);
            amount -= (long)discount;
        }

        return amount;
    }
    private long CalculateSubtotal(ShoppingCart cart)
    {
        var itemTotal = cart.Items.Sum(x => x.Quantity * x.Price * 100);
        return (long)itemTotal;
    }
    private async Task ValidateCartItemsInCartAsync(ShoppingCart cart)
    {
        foreach (var item in cart.Items)
        {
            var productItem = await unit.Repository<Core.Entities.Product>()
                .GetByIdAsync(item.ProductId) 
                ?? throw new Exception("Problem sa unosom proizvoda u korpu");
            if (item.Price != productItem.Price)
            {
                item.Price = productItem.Price;
            }
        }
    }
    private async Task<long?> GetShippingPriceAsync(ShoppingCart cart)
    {
        if (cart.DeliveryMethodId.HasValue)
        {
            var deliveryMethod = await unit.Repository<DeliveryMethod>()
                .GetByIdAsync((int)cart.DeliveryMethodId)
                    ?? throw new Exception("Problem sa načinom isporuke");
            return (long)deliveryMethod.Price * 100;
        }
        return null;
    }
 }


// using Core.Entities;
// using Core.Interfaces;
// using Microsoft.Extensions.Configuration;
// using Stripe;

// namespace Infrastructure.Services;

// public class PaymentService(IConfiguration config, ICartService cartService, IUnitOfWork unit) : IPaymentService
// {
//     public async Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId)
//     {
//         StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

//         var cart = await cartService.GetCartAsync(cartId);

//         if (cart == null) return null;

//         var shippingPrice = 0m;

//         if (cart.DeliveryMethodId.HasValue)
//         {
//             var deliveryMethod = await unit.Repository<DeliveryMethod>().GetByIdAsync((int)cart.DeliveryMethodId);

//             if (deliveryMethod == null) return null;

//             shippingPrice = deliveryMethod.Price;
//         }

//         foreach (var item in cart.Items)
//         {
//             var productItem = await unit.Repository<Core.Entities.Product>().GetByIdAsync(item.ProductId);

//             if (productItem == null) return null;

//             if (item.Price != productItem.Price)
//             {
//                 item.Price = productItem.Price;
//             }
//         }

//         var service = new PaymentIntentService();
//         PaymentIntent? intent = null;

//         if (string.IsNullOrEmpty(cart.PaymentIntentId))
//         {
//             var options = new PaymentIntentCreateOptions
//             {
//                 Amount = (long)cart.Items.Sum(x => x.Quantity * (x.Price * 100)) + (long)shippingPrice * 100, 
//                 Currency= "bam",
//                 PaymentMethodTypes = ["card"]
//             };
//             intent = await service.CreateAsync(options);
//             cart.PaymentIntentId = intent.Id;
//             cart.ClientSecret = intent.ClientSecret;
//         }
//         else
//         {
//             var options = new PaymentIntentUpdateOptions
//             {
//                 Amount = (long)cart.Items.Sum(x => x.Quantity * (x.Price * 100)) + (long)shippingPrice * 100
//             };
//             intent = await service.UpdateAsync(cart.PaymentIntentId, options);
//         }

//         await cartService.SetCartAsync(cart);

//         return cart;
//     }
// }
