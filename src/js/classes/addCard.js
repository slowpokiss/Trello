export default class AddCard {
  constructor() {
    this.cardList = document.querySelectorAll(".card-list");
    this.cards = document.querySelectorAll(".card");

    window.addEventListener("beforeunload", () => {
      this.formData = [];
      this.update();
      this.cardList.forEach((element, index) => {
        this.formData.push({ element: element.innerHTML, index });
      });

      localStorage.setItem("formData", JSON.stringify(this.formData));
    });

    document.addEventListener("DOMContentLoaded", () => {
      const json = localStorage.getItem("formData");

      let formData;
      try {
        formData = JSON.parse(json);
      } catch (error) {
        console.log(error);
      }

      if (formData) {
        this.updatePage(formData);
        this.addGrabbing();
      }
    });
    this.addGrabbing();

    this.addBtn = document.querySelectorAll(".add-card");
    this.cardList.forEach((el) => {
      el.addEventListener("click", (ev) => {
        ev.preventDefault();
        if (ev.target.classList[0] === "card-del-btn") {
          this.removeElem(ev.target.parentElement);
        }
      });
    });

    this.addBtn.forEach((el, ind) => {
      el.addEventListener("click", (ev) => {
        ev.preventDefault();
        const curr = el.parentElement.querySelector(".add-form-field");
        if (!curr) {
          console.log(el);
          this.addForm(el.parentElement, ind);
        } else {
          this.removeElem(curr);
        }
      });
    });
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

    form.querySelector(".add-form").addEventListener("submit", (ev) => {
      ev.preventDefault();
      this.addCard(form.querySelector(".add-input").value, index);
      form.querySelector(".add-input").value = "";
      this.removeElem(form);
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
    this.update();
    let actualElem;
    const onMouseOver = (ev) => {
      actualElem.style.top = ev.clientY + "px";
      actualElem.style.left = ev.clientX + "px";
    };

    const onMouseUP = (ev) => {
      const targetElem = ev.target;

      targetElem.parentElement.insertBefore(actualElem, targetElem);
      actualElem.classList.remove("dragged");
      actualElem = undefined;
      document.documentElement.removeEventListener("mouseup", onMouseUP);
      document.documentElement.removeEventListener("mouseover", onMouseOver);
    };

    this.cards.forEach((el) => {
      el.addEventListener("mousedown", (ev) => {
        ev.preventDefault();

        if (ev.target.classList[0] === "card") {
          actualElem = ev.target;
          actualElem.classList.add("dragged");
          document.documentElement.addEventListener("mouseup", onMouseUP);
          document.documentElement.addEventListener("mouseover", onMouseOver);
        }
      });
    });
  }
}
