import './scss/main.scss'
// button declare
const controlButton = document.querySelector(".control-button");
const prevButton = document.querySelector(".control-button__previous");
const nextButton = document.querySelector(".control-button__next");
// forms part declare
const formParts = document.querySelectorAll(".part");
// steps part declare
const steps = document.querySelectorAll(".stepper__wrapper__step");
const cartPanel = document.querySelector(".cart-panel");
// shipping part declare
const shippingPanel = document.querySelector(".part.shipping-method");
const standardShipping = document.querySelector('.standard');
const dhlShipping = document.querySelector('.dhl');

let step = 0;
controlButton.addEventListener("click", handleFormStep);

function handleFormStep (e) {
  e.preventDefault();

  const nowStep = steps[step];
  console.log("nowStep:", nowStep);
  console.log("target:", e.target);
  if (
    e.target.classList.contains("control-button__next") &&
    e.target.innerHTML === "下一步"
  ) {
    const nextStep = steps[step + 1];
    console.log("nextStep:", nextStep);
    nowStep.classList.remove("active");
    nowStep.classList.add("checked");
    nextStep.classList.add("active");
    formParts[step].classList.toggle("d-none");
    formParts[step + 1].classList.toggle("d-none");
    step += 1;
  } else if (e.target.classList.contains("control-button__previous")) {
    const prevStep = steps[step - 1];
    console.log("prevStep:", prevStep);
    nowStep.classList.remove("active");
    prevStep.classList.remove("checked");
    prevStep.classList.add("active");
    formParts[step].classList.toggle("d-none");
    formParts[step - 1].classList.toggle("d-none");
    step -= 1;
  }
  setButtonDisable();
}

function setButtonDisable () {
  step === 0
    ? prevButton.classList.add("d-none")
    : prevButton.classList.remove("d-none");
  step === 2
    ? (nextButton.innerText = "確認下單")
    : (nextButton.innerText = "下一步");
}

const cartItems = document.querySelector(".cart__items");

// cartItem
const model = {
  city: [
    "臺北市",
    "新北市",
    "桃園市",
    "臺中市",
    "臺南市",
    "高雄市",
    "新竹縣",
    "苗栗縣",
    "彰化縣",
    "南投縣",
    "雲林縣",
    "嘉義縣",
    "屏東縣",
    "宜蘭縣",
    "花蓮縣",
    "臺東縣",
    "澎湖縣",
    "金門縣",
    "連江縣",
    "基隆市",
    "新竹市",
    "嘉義市"
  ],
  cartItem: [
    {
      id: 1,
      description: "破壞補丁修身牛仔褲",
      amount: 1,
      price: 3999,
      subtotal: 3999,
      image: "/src/pictures/item1@2x.png"
    },
    {
      id: 2,
      description: "刷色直筒牛仔褲",
      amount: 1,
      price: 1299,
      subtotal: 1299,
      image: "/src/pictures/item2@2x.png"
    }
  ],
  controlAmount (itemID, modify) {
    const item = this.cartItem.find((item) => item.id === Number(itemID));
    if (modify === "plus") {
      item.amount++;
    } else if (modify === "minus") {
      if (item.amount > 0) {
        item.amount--;
      } else {
        return;
      }
    }
    this.recalculateItemTotal(item);
  },
  recalculateItemTotal (item) {
    item.subtotal = item.price * item.amount;
    this.recalculateTotalAmount(item);
  },
  recalculateTotalAmount (item) {
    let totalAmount = 0;
    this.cartItem.forEach((item) => {
      totalAmount += item.subtotal;
    });
    return totalAmount;
  }
};

const selectCity = document.querySelector('[name="city"]');
const titleValue = document.querySelector(".cart-total.title-value");
const view = {
  renderCity () {
    let innerHTML = `<option value="">--Please select city--</option>`;
    model.city.forEach((item) => {
      innerHTML += `
      <option value="">${item}</option>`;
    });
    selectCity.innerHTML = innerHTML;
  },
  renderCartList () {
    let rawHTML = ``;
    model.cartItem.forEach((item) => {
      rawHTML += `
        <div class="cart__items__item">
          <div class="cart__items__item__image">
            <img src="${item.image}" alt="">
          </div>
          <div class="cart__items__item__information">
            <div class="cart__items__item__information__name">
              ${item.description}
            </div>
            <div class="cart__items__item__information__amount" data-id="${item.id}">
             <button class="amount_btn minus cursor-pointer"><i class="fa-solid fa-minus"></i></button>
             <span class="amount">${item.amount}</span>
             <button class="amount_btn plus cursor-pointer"><i class="fas fa-plus"></i></button>
            </div>
            <div class="cart__items__item__information__price">$<span></span>${item.subtotal}</div>
          </div>
        </div>
      `;
    });
    cartItems.innerHTML = rawHTML;
  },
  renderTotal () {
    titleValue.innerText = `${model.recalculateTotalAmount()}`;
  },
  renderPage () {
    this.renderCartList();
    this.renderTotal();
    this.renderCity();
  }
};
const controller = {
  controlItemAmount (target, modify) {
    let id = target.parentElement.dataset.id;
    model.controlAmount(id, modify);
    view.renderCartList();
    view.renderTotal();
  }
};
view.renderPage();

shippingPanel.addEventListener("click", function (e) {
  if (e.target.closest('.standard')) {
    console.log("closestStandard:", e.target);
    dhlShipping.classList.remove("shipping-active");

    standardShipping.classList.add("shipping-active");

  } else if (e.target.closest('.dhl')) {
    console.log("closestDHL:", e.target);
    standardShipping.classList.remove("shipping-active");
    dhlShipping.classList.add("shipping-active");
  }
});

cartPanel.addEventListener("click", function (event) {
  const target = event.target.matches(".amount_btn")
    ? event.target
    : event.target.parentElement;
  if (target.matches(".plus")) {
    controller.controlItemAmount(target, "plus");
  }
  if (target.matches(".minus")) {
    controller.controlItemAmount(target, "minus");
  }
});
