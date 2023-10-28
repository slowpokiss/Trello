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

    this.MouseDownCb = (ev) => {
      if (ev.target.classList.contains('card') && !ev.target.classList.contains("card-del-btn")) {
        actualElem = ev.target.closest('.card');
        this.shiftX = ev.offsetX;
        this.shiftY = ev.offsetY;
        
        actualElem.style = `
				left: ${ev.pageX - this.shiftX}px;
				top: ${ev.pageY - this.shiftY}px;
			  `
        actualElem.classList.add("dragged");
      } else {
        return
      }
    }

    this.MouseUpCb = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (!actualElem) {
        return;
      }
      
      const x1 = parseFloat(actualElem.style.left)
      const y1 = parseFloat(actualElem.style.top)
      const targetElem = document.elementFromPoint(x1, y1);
      
      if (targetElem.classList.contains("card")) {
        let list = targetElem.closest(".card-list");
        list.insertBefore(actualElem, targetElem);
      }
      if (targetElem.classList.contains("card-list")) {
        targetElem.appendChild(actualElem);
      }

      actualElem.style.top = '';
      actualElem.style.left = '';
      this.shiftX = null;
      this.shiftY = null;
      actualElem.classList.remove("dragged");
      actualElem = undefined;
    }

    
    this.MouseMoveCb = (ev) => {
      ev.stopPropagation();
      if (!actualElem) {
        return;
      }
      console.log(ev.target)
      actualElem.style.top = ev.pageY - this.shiftY + "px";
      actualElem.style.left = ev.pageX - this.shiftX + "px";
    }

    document.addEventListener("mousedown", this.MouseDownCb);
    document.addEventListener("mouseup", this.MouseUpCb);
    document.addEventListener("mousemove", this.MouseMoveCb);
  }


}