let subscriptionController = {}
let subscriptionModel = require('../models/subscription')
let userModel = require('../models/user')
let stripe = require('stripe')(process.env.STRIPE_KEY)

// PLANS
subscriptionController.GET_SUBSCRIPTION_PLANS = (req, res) => {}

subscriptionController.CREATE_NEW_PLAN = (req, res) => {
  return stripe.plans
    .create({
      product: 'prod_D37TbZZ1K0jtVL',
      nickname: 'Ooloo Subscription',
      currency: 'usd',
      interval: 'month',
      amount: 10000, // $10
    })
    .then(plan => {
      console.log('plan', plan)
      res.status(200).send({
        plan,
      })
    })
}

subscriptionController.DELETE_PLAN = (req, res) => {}

// CUSTOMERS
subscriptionController.CREATE_CUSTOMER = (req, res) => {
  let userId = req.user.id
  let cardToken = req.body.cardToken

  return userModel.GET_USER(userId).then(user => {
    return stripe.customers
      .create({
        email: user.email,
        source: cardToken,
      })
      .then(customer => {
        // Charge the Customer instead of the card:
        const charge = stripe.charges.create({
          amount: 1000,
          currency: 'usd',
          customer: customer.id,
        })

        return subscriptionModel.SAVE_CUSTOMER_ID(userId, customer.id).then(customer => {
          res.status(200).send({ customer })
        })
      })
  })
}

subscriptionController.DELETE_CUSTOMER = (req, res) => {
  let userId = req.user.id
}

// SUBSCRIPTIONS
subscriptionController.CREATE_USER_SUBSCRIPTION = (req, res) => {
  return stripe.subscriptions
    .create({
      customer: 'cus_D37XHE0pDzwiSc',
      items: [{ plan: 'plan_D37UJBYkjT1tyP' }],
    })
    .then(subscription => {
      console.log('subscription', subscription)
      res.status(200).send({
        subscription,
      })
    })
}

subscriptionController.CANCEL_SUBSCRIPTION = (req, res) => {}

// PRODUCTS
subscriptionController.CREATE_NEW_PRODUCT = (req, res) => {
  return stripe.products
    .create({
      name: 'subscription',
      type: 'service',
    })
    .then(product => {
      console.log('product', product)
      res.status({
        product,
      })
    })
}

subscriptionController.DELETE_PRODUCT = (req, res) => {}

module.exports = subscriptionController
