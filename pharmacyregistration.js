
 const regionSelect = document.getElementById("region");
  const addisSubcity = document.getElementById("addis-subcity");
  const otherCity = document.getElementById("other-city");

  regionSelect.addEventListener("change", () => {
    if (regionSelect.value === "Addis Ababa") {
      addisSubcity.classList.remove("hidden");
      otherCity.classList.add("hidden");
    } else {
      addisSubcity.classList.add("hidden");
      otherCity.classList.remove("hidden");
    }
  });




      
      function check_password(){
        const password=document.getElementById("password").value;
        const confirm_password=document.getElementById("confirm_password").value;
        const output_message =document.getElementById("output_message");
        if(password==confirm_password){
          output_message.textContent="";
          return true;
        }
        else{
          output_message.textContent="your password is not matching";
          return false;
        }
      }
      
      
      function validateAgrement(){
        const check_agrement=document.getElementById("service-agrement");
        if(!check_agrement.checked){
          alert('You must agree to the Terms of Service before submitting.');
          return false;
        }
        return true;
      }
      
      
       function validate_password(){
         const password=document.getElementById("password").value;
         const Error_message=document.getElementById("Error_message");
         if(password.length<8){
           Error_message.textContent="your password length should be minmum of 8  character";
           return false;
         }
         else if(!/[A-Z]/.test(password)){
           Error_message.textContent="your password should contain atleast one upper case";
           return false;
         }
         else if(!/[^A-Za-z0-9]/.test(password)){
           Error_message.textContent="your password should include a special character";
           return false;
         }
         else{
           Error_message.textContent="";
           return true;
         }
       }
       
       
       function submitcase(){
         const isvalidated=validate_password();
         const ischecked=check_password();
         const isagreed=validateAgrement();
         if((ischecked&&isvalidated)&&isagreed){
          return true; 
         }
         else{
           return false;
         }
       }
   
