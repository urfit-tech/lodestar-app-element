
EEC

- productImpression

lodestar-app (core & commonhealth)
* ProgramSection
* ProgramCollectionPage
* ActivitySection
* ActivityCollectionPage

lodestar-app-element
* ProgramCollection
* ActivityCollection
* ProgramPackageCollection

DataProperties: 
- input: program.id[], activity.id[], programPackage.id[]

--------------------------

- productClick

* 需從 pageFrom 拿參數 -> 從哪裡點進來的

lodestar-app
* ProgramCard.onClick


lodestar-app-element

DataProperties:
- input: 
  program, activity, programPackage
  pageFrom

--------------------------

- productDetail

* 需從 pageFrom 拿參數 -> 從哪裡點進來的

lodestar-app
- ProgramPage
- ActivityPage
- ProgramPackagePage

DataProperties:
- input: 
  program, activity, programPackage
  pageFrom

--------------------------

- addToCart

lodestar-app (commonhealth)
- PrpgramPlanPaymentButton
- ProgramSubscriptionPlanCard-> CheckoutProductModal.renderTrigger

DataProperties:
- input: 
  productId -> ex: ProgramPlan_xxxxx, ActivityTicket_xxxxx
  * 需從 product 找到 metaProduct

--------------------------

- removeFromCart

lodestar-app (commonhealth)
- CartProductTableCard


DataProperties:
- input: 
  productId -> ex: ProgramPlan_xxxxx, ActivityTicket_xxxxx
  * 需從 product 找到 metaProduct

--------------------------

Summary:
addToCart & removeFromCart 兩個事件都放在 CartContext 就好

--------------------------

- Checkout

lodestar-app (commonhealth)
- CartPage

DataProperties:
- input: 
  productId -> ex: ProgramPlan_xxxxx, ActivityTicket_xxxxx
  * 需從 product 找到 metaProduct

--------------------------

- CheckoutOption

lodestar-app (commonhealth)
- PaymentTaskPage

DataProperties:
- input: 
  productId -> ex: ProgramPlan_xxxxx, ActivityTicket_xxxxx
  * 需從 product 找到 metaProduct

--------------------------

- Purchase

lodestar-app (commonhealth)
- OrderPage

DataProperties:
- input: 
  orderId
  * orderProduct -> productDetail