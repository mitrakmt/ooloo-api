let subscriptionController = {}
let subscriptionModel = require('../models/subscription')
let userModel = require('../models/user')
let stripe = require('stripe')(process.env.STRIPE_KEY)

// PLANS
subscriptionController.GET_SUBSCRIPTION_PLANS = (req, res) => {}

subscriptionController.CREATE_NEW_PLAN = (req, res) => {
  return stripe.plans.create(
    {
      product: 'subscription',
      nickname: 'Ooloo Subscription',
      currency: 'usd',
      interval: 'month',
      amount: 10000, // $10
    },
    plan => {
      console.log('plan', plan)
      return {
        plan,
      }
    },
  )
}

subscriptionController.DELETE_PLAN = (req, res) => {}

// CUSTOMERS
subscriptionController.CREATE_CUSTOMER = (req, res) => {
  let userId = req.user.id

  return userModel.GET_USER(userId).then(user => {
    const customer = stripe.customers.create(
      {
        email: user.email,
        source: 'mobile',
      },
      customer => {
        console.log('customer', customer)
        res.status(200).send(customer)
      },
    )
  })
  // Returns
  // {
  //   "id": "cus_4fdAW5ftNQow1a",
  //   "object": "customer",
  //   "account_balance": 0,
  //   "created": 1528903495,
  //   "currency": null,
  //   ...
  //   "livemode": false,
  //   "email": "jenny.rosen@example.com",
  //   ...
  // }
}

subscriptionController.DELETE_CUSTOMER = (req, res) => {
  let userId = req.user.id
}

// SUBSCRIPTIONS
subscriptionController.CREATE_USER_SUBSCRIPTION = (req, res) => {
  return stripe.subscriptions.create({
    customer: 'cus_4fdAW5ftNQow1a',
    items: [{ plan: 'plan_CBXbz9i7AIOTzr' }],
  })
}

subscriptionController.CANCEL_SUBSCRIPTION = (req, res) => {}

// PRODUCTS
subscriptionController.CREATE_NEW_PRODUCT = (req, res) => {
  return stripe.products.create(
    {
      name: 'subscription',
      type: 'subscription',
    },
    product => {
      console.log('product', product)
      return {
        product,
      }
    },
  )
}

subscriptionController.DELETE_PRODUCT = (req, res) => {}

module.exports = subscriptionController
