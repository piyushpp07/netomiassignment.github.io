const frame = document.querySelector("#frame");
const container = document.querySelector("#container");
window.onload = function () {
   const iframeDocument = frame.contentDocument
      ? frame.contentDocument
      : frame.contentWindow.document;
   const form = iframeDocument.querySelector("#form");
   const name = iframeDocument.querySelector("#username");
   const email = iframeDocument.querySelector("#useremail");
   const contact = iframeDocument.querySelector("#usercontact");
   const country = iframeDocument.querySelector("#usercountry");
   const states = iframeDocument.querySelector("#userstates");
   const date = iframeDocument.querySelector("#userdate");
   const submit = iframeDocument.querySelector("#submit");

   const api = fetch(
      "https://raw.githubusercontent.com/stefanbinder/countries-states/master/countries.json"
   );

   let all = [];
   let country1 = [];
   api.then((result1) => {
      result1.json().then((api) => {
         all = api;
         country1 = api.map((obj) => obj.name);
         addition(country, country1);
      });
   });

   const stateDrop = (event) => {
      if (event.target.value == "") {
         states.style.display = "inline-block";
      } else {
         states.style.display = "inline-block";
      }
   };

   const addition = (parentEle, arr) => {
      const newAdd = document.createElement("option");
      parentEle.appendChild(newAdd);
      arr.forEach((ele) => {
         const newAdd = document.createElement("option");
         newAdd.value = ele;
         newAdd.text = ele;
         parentEle.appendChild(newAdd);
      });
   };

   const resState = async (event) => {
      stateDrop(event);
      const length = states.options.length;
      for (i = length - 1; i >= 0; i--) {
         states.options[i] = null;
      }
      let requestdata = all.filter((item) => item.name == event.target.value);
      if (requestdata.length != 0) {
         let statesData = requestdata[0].states.map((state) => state.name);
         addition(states, statesData);
      }
   };

   country.addEventListener("change", resState);
   let result = {};
   const checkEmail = () => {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {
         return true;
      }
      return false;
   };
   const formValidity = () => {
      result = {};
      if (name.value.length < 4 || name.value.length > 10 || name.value == "") {
         const obj = { error: "length should be in between 4-10 characters" };
         result["Name"] = obj;
      }
      if (!checkEmail()) {
         const obj = { Error: "only valid email address" };
         result["Email"] = obj;
      }
      if (contact.value.length != 10 || contact.value == "") {
         const obj = { Error: "number should be 10 digits" };
         result["Contact number"] = obj;
      }
      if (date.value == "") {
         const obj = { Error: "mandatory field" };
         result["Date"] = obj;
      }
      if (country.value == "") {
         const obj = { Error: "mandatory field" };
         result["Country"] = obj;
      }
      if (states.value == "") {
         const obj = { Error: "mandatory field" };
         result["State"] = obj;
      }

      if (Object.keys(result).length == 0) {
         result["Success"] = "All fields are valid";
      }
   };
   const validateError = (event) => {
      event.preventDefault();
      formValidity();
      window.postMessage({ messsage: "Result", value: result });
   };
   submit.addEventListener("click", validateError);
   form.addEventListener("change", function () {
      container.innerText = "";
   });
};

window.addEventListener("message", showMessage);
function showMessage(data) {
   container.innerText =
      data.data.messsage + ":" + JSON.stringify(data.data.value);
}