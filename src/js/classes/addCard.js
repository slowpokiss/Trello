export default class AddCard {
  constructor() {
    this.cardList = document.querySelectorAll(".card-list");
    this.cards = document.querySelectorAll(".card");

    this.init();
  }

  init() {
    // window.addEventListener("beforeunload", () => {
    //   this.formData = [];
    //   this.update();
    //   this.cardList.forEach((element, index) => {
    //     this.formData.push({ element: element.innerHTML, index });
    //   });

    //   localStorage.setItem("formData", JSON.stringify(this.formData));
    // });

    // document.addEventListener("DOMContentLoaded", () => {
    //   const json = localStorage.getItem("formData");

    //   let formData;
    //   try {
    //     formData = JSON.parse(json);
    //   } catch (error) {
    //     console.log(error);
    //   }

    //   if (formData) {
    //     this.updatePage(formData);
    //     this.addGrabbing();
    //   }
    // });

    this.cardList.forEach((el) => {
      el.addEventListener("click", (ev) => {
        ev.preventDefault();
        if (ev.target.classList[0] === "card-del-btn") {
          ev.target.closest(".card").remove();
        }
      });
    });

    this.addBtn = document.querySelectorAll(".add-card");
    this.addBtn.forEach((el, ind) => {
      el.addEventListener("click", (ev) => {
        ev.preventDefault();
        const curr = el.parentElement.querySelector(".add-form-field");
        if (!curr) {
          console.log(this);
          this.addForm(el.parentElement, ind);
        } else {
          this.removeElem(curr);
        }
      });
    });

    this.addGrabbing();
  }

  updatePage(data) {
    this.update();
    this.cardList.forEach((el, ind) => {
      el.innerHTML = data[ind].element;
    });
  }

  addForm(element, index) {
    const form = document.createElement("div");
    form.classList.add("add-form-field");
    form.insertAdjacentHTML(
      "beforeend",
      `<form class="add-form">
      <input class="add-input" type="text" placeholder="Enter a title for this card...">
      <div class="add-actions"><input class="add-btn" type="submit" value="Add Card"><p class="close-form">&#10006;</p></div>
      </form>`
    );
    element.appendChild(form);

    form.querySelector(".close-form").addEventListener("click", (ev) => {
      ev.preventDefault();
      this.removeElem(form);
    });

    form.querySelector(".add-input").value = '1321321321321'
    form.querySelector(".add-form").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const formInput = form.querySelector(".add-input")
      if (formInput.value != '') {
        this.addCard(formInput.value, index);
        form.querySelector(".add-input").value = "";
        this.removeElem(form);
      }
      
    });
  }

  addCard(title, index) {
    const newCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.textContent = title;
    newCard.insertAdjacentHTML(
      "beforeend",
      `<p class="card-del-btn">&#10006;</p>`
    );
    this.cardList[index].appendChild(newCard);
    this.addGrabbing();
  }

  removeElem(elem) {
    elem.remove();
  }

  update() {
    this.cardList = document.querySelectorAll(".card-list");
    this.cards = document.querySelectorAll(".card");
  }

  addGrabbing() {
    let actualElem;
    let actualElemPosition, actualTop, actualLeft;

    document.addEventListener("mousedown", (ev) => {
      ev.preventDefault();
      if (actualElem) {
        return;
      }
      actualElem = ev.target.closest(".card");
      if (!actualElem || ev.target.classList[0] === "card-del-btn") {
        return;
      } else {
        actualElem.classList.add("dragged");
        // actualElem.style.top = '';
        // actualElem.style.left = '';

        actualElemPosition = actualElem.getBoundingClientRect()
        actualTop = ev.clientY - actualElemPosition.top;
        actualLeft = ev.clientX - actualElemPosition.left;
        actualElem.style.top = actualTop;
        actualElem.style.left = actualLeft;
      }
    });

    document.addEventListener("mouseup", (ev) => {
      ev.preventDefault();

      if (!actualElem) {
        return;
      }
      
      const x = ev.pageX;
      const y = ev.pageY;
    
      //const targetElem = document.elementFromPoint(x, y);
      const targetElem = ev.target

      if (targetElem.classList.contains("card")) {
        let list = targetElem.closest(".card-list");
        list.insertBefore(actualElem, targetElem);
      }
      if (targetElem.classList[0] === "card-list") {
        targetElem.appendChild(actualElem);
      }

      actualElem.style.top = '';
      actualElem.style.left = '';
      actualElemPosition = undefined;
      actualTop = undefined;
      actualLeft = undefined;
      actualElem.classList.remove("dragged");
      actualElem = undefined;
    });

    document.addEventListener("mousemove", (ev) => {
      ev.preventDefault();
      if (!actualElem) {
        return;
      }

      actualElem.style.top = ev.clientY - actualTop + "px";
      actualElem.style.left = ev.clientX - actualLeft + "px";
    });
  }
}
